# TikTok_Bitrix24_Leads
Ứng dụng tích hợp TikTok Lead Generation với Bitrix24 CRM.

1) Các bước thực hiện

Setup dự án: npm install

Tạo .env (tham khảo .env.example): cp .env.example .env

Chay docker:  "docker compose up -d".
Recommend: nên dùng app docker để check log cụ thể

tạo db tự động: "npm run db:generate"

Chạy Database: "npm run db:migrate"

Chạy ứng dụng: "npm run start: dev"

run test: npm run test,
npm run test:e2e,
npm run test:cov

Test sau khi chạy ứng dụng:
http://localhost:3000/docs để test trên swagger hoặc test trên postman. ngoài ra có thể vào:
http://localhost:3000/health để test


dám 2 dòng trên vào CMD để tạo file thì coppy key dưới cùng để test api : /webhooks/tiktok/leads.

2) Cấu trúc dự án:

src/
└─ main/
├─ common/            # Tiện ích dùng chung cho toàn app
│  ├─ filters/        # HttpExceptionFilter, v.v.
│  ├─ interceptors/   # LoggingInterceptor, đo thời gian, v.v.
│  ├─ pipes/          # ValidationPipe, parse/transform input
│  └─ utils/          # helper: verifySignature, chuẩn hoá phone, ...
├─ config/            # Đọc/validate ENV, cấu hình App/Swagger (nếu có)
├─ controller/        # Lớp HTTP adapter (REST endpoints)
├─ exception/         # Lỗi tuỳ biến (AppError, …)
├─ integrations/
│  └─ bitrix/         # Tích hợp Bitrix24 (BitrixClient, BitrixModule)
├─ jobs/              # BullMQ processor, push job sync sang Bitrix
├─ model/
│  ├─ dto/            # DTO + class-validator cho request/response
│  └─ entities/       # TypeORM entities (LeadEntity, DealEntity, Configuration)
├─ module/
│  ├─ database/       # Kết nối TypeORM, migrations, seeds
│  ├─ analyticsModule.ts
│  ├─ configStoreModule.ts
│  ├─ dealsModule.ts
│  ├─ exporterModule.ts
│  └─ leadsModule.ts
├─ service/           # Business logic (LeadsService, DealsService, …)
├─ app.controller.spec.ts  # unit test
├─ app.controller.ts       
├─ app.module.ts           
├─ app.service.ts          
└─ main.ts                 # Bootstrap Nest (global pipes/filters, Swagger)

3) Architecture diagram (lowchart LR):

- TT[TikTok Lead Gen] -->|Webhook| A[/POST /webhooks/tiktok/leads/]
- A --> TikTokSvc[TikTokService]
- TikTokSvc --> LeadsSvc[LeadsService]
- LeadsSvc --> PG[(PostgreSQL)]
- LeadsSvc -->|enqueue| Q[(Redis/BullMQ)]

- Q --> Job[BitrixSyncProcessor]
- Job -->|REST| BX[Bitrix24 API]

- BX24[Bitrix24] -->|Webhook| B[/POST /webhooks/bitrix24/deals/]
- B --> DealsSvc[DealsService]
- DealsSvc --> PG

- Analytics[AnalyticsService] --> PG
- Exporter[ExporterService] --> PG

- Docs[Swagger UI /docs] -.-> App[NestJS App]
- Health[/GET /health/] -.-> App

Luồng điển hình:

- TikTok → POST /webhooks/tiktok/leads (controller)
- TikTokService → LeadsService: sanitize + upsert DB → enqueue job sync Bitrix (nếu rule)
- BitrixSyncProcessor (jobs) đọc từ Redis → gọi BitrixClient (crm.lead.add/crm.deal.add)
- ConfigStore: GET/PUT /api/v1/config/mappings|rules lưu JSON (CONFIGURATIONS.value)

Hàng đợi & giới hạn tốc độ:

- Job xử lý đồng bộ sang Bitrix chạy trong BullMQ trên Redis.
- Có rate limit để tránh quota API (ví dụ 40 job/giây hoặc theo BITRIX_RATE_*).


Database ERD:

    LEADS {
        uuid id PK
        varchar(128) external_id "UK"
        varchar(32)  source
        varchar(255) name
        varchar(255) email
        varchar(32)  phone
        varchar(64)  campaign_id
        varchar(64)  ad_id
        jsonb        raw_data
        int          bitrix24_id
        varchar(32)  status
        Date    created_at
        Date    updated_at
    }

    DEALS {
      uuid id PK
      int          bitrix24_id
      varchar(255) title
      numeric(14,2) amount
      varchar(8)   currency
      varchar(64)  stage
      int          probability
      varchar(128) external_id "UK"
      jsonb        raw_data
      uuid         lead_id FK
      Date    created_at
      Date    updated_at
    }

    CONFIGURATIONS {
      int id PK
      varchar(64) key "UK"
      jsonb       value
      Date   updated_at
    }

    LEADS ||--o{ DEALS : "lead_id (nullable)"


4) Kiểm thử: Testing Api
- Webhook TikTok:
   - Ký HMAC (sha256) cho body:
set SECRET=1830e364a4b724e65b110bdd9f2bb3d4c4959c9a280e94ff3d1b764bab80597e
node -e "const crypto=require('crypto'); const body=process.argv[1]; const secret=process.env.SECRET; console.log(crypto.createHmac('sha256', secret).update(body).digest('base64'));" "{\"event_id\":\"evt_1001\",\"lead_data\":{\"full_name\":\"Nguyen Van A\",\"email\":\"a@example.com\",\"phone\":\"+84901234567\"},\"campaign\":{\"campaign_id\":\"cmp_111\",\"ad_id\":\"ad_222\"}}"

   - Copy giá trị in ra → điền vào header tiktok-signature.

   - Với DEV có SKIP_SIGNATURE_VERIFY=1, bạn có thể bỏ qua bước này.

- Gọi API POST /webhooks/tiktok/leads:
     - Headers:
        - Content-Type: application/json
        - tiktok-signature: <base64 hmac>

     - Body (Example):
       - {
           "event_id": "evt_1001",
           "lead_data": {
           "full_name": "Nguyen Van A",
           "email": "a@example.com",
           "phone": "+84901234567"
              },
           "campaign": { "campaign_id": "cmp_111", "ad_id": "ad_222" }
          }

     - Kết quả: lead được upsert vào bảng leads (tránh trùng theo external_id/email/phone) và enqueue job đẩy sang Bitrix nếu rule phù hợp.

- Endpoints quản trị & cấu hình:
     - Leads/Deals:
          - GET /api/v1/leads?page=1&limit=10&source=tiktok
          - POST /api/v1/leads/{id}/convert-to-deal
               - Body:{ "title": "Deal from TikTok", "amount": 1000000, "currency": "VND" }

          - GET /api/v1/deals?status=open&assigned_to=<user_id> (nếu đã hiện thực)

- Config mappings & rules:
    - GET /api/v1/config/mappings
    - PUT /api/v1/config/mappings
       - Body mẫu:
{
"lead_data.full_name": "NAME",
"lead_data.email": "EMAIL[0][VALUE]",
"lead_data.phone": "PHONE[0][VALUE]",
"lead_data.city": "UF_CRM_CITY",
"campaign.campaign_name": "UF_CRM_UTM_CAMPAIGN",
"campaign.ad_name": "UF_CRM_AD_NAME",
"lead_data.ttclid": "UF_CRM_TTCLID"
}

    - GET /api/v1/config/rules

    - PUT /api/v1/config/rules
       - Body mẫu:
{
"auto_convert": true,
"min_probability": 30,
"assign_user_id": 123
}

  - Hoặc biến thể rule theo đề bài (nhiều điều kiện) tuỳ vào trường hợp sử dụng để chạy.

- Tích hợp Bitrix24:
   - Base URL chuẩn Bitrix REST:
      - https://<portal>.bitrix24.vn/rest/<user_id>/<token>
      - Ví dụ thực thi tạo deal (server → server):
        - Path: crm.deal.add.json
        - Method: POST
        - Body:{ "fields": { "TITLE": "API Deal", "OPENED": "Y" }, "params": { "REGISTER_SONET_EVENT": "N" } }

      - Nếu gọi sai đường dẫn (thiếu /rest/<user>/<token>), Bitrix sẽ trả 404 Not Found (Nginx).

- Client DI:
   - BitrixClient khởi tạo từ env:
     - BITRIX_BASE_URL (ở real phải chứa /rest/<user>/<token>)
     - BITRIX_TOKEN (tùy mock)
   - Rate limit job khi đẩy sang Bitrix dựa theo BITRIX_RATE_MAX, BITRIX_RATE_DURATION (ms).

- Analytics & Export:
    - GET /api/v1/analytics/conversion-rates
    - GET /api/v1/analytics/campaign-performance
    - GET /api/v1/reports/export?format=csv&date_range=30d

11) Troubleshooting
    Vấn đề	                                            Nguyên nhân thường gặp	                                 Cách khắc phục
    500 khi POST /webhooks/bitrix24/deals	            Body không đúng schema	                                 Gửi JSON theo mẫu (id/title/amount/currency hoặc payload bạn đã định nghĩa). Xem log server.
    404 Not Found khi gọi Bitrix từ Postman	            Sai base URL Bitrix (thiếu /rest/<user>/<token>)	     Sửa BITRIX_BASE_URL đúng format Bitrix REST, gọi đúng method crm.deal.add.json.
    Signature sai khi test TikTok	                    Sai secret/không base64	                                 Tạo lại chữ ký HMAC-SHA256 với secret đúng; hoặc bật SKIP_SIGNATURE_VERIFY=1 trong DEV.
    Không thấy lead mới	                                external_id/email/phone trùng	                         Upsert đã gộp; đổi event_id hoặc email/phone để sinh lead mới.
    DB connect lỗi	                                    Chưa chạy Postgres/Redis, port sai	                     docker compose up -d, kiểm tra .env & firewall.
    Hàng đợi không đẩy sang Bitrix	                    Redis không chạy/queue blocked	                         Kiểm tra Redis, rate limit, và log của BitrixSyncProcessor.
    Swagger không có endpoint mới	                    Chưa rebuild/khởi động lại	                             Khởi động lại app, kiểm tra decorators @Api* có đúng.