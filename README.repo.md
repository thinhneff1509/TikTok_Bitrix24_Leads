# TikTok_Bitrix24_Leads
Ứng dụng tích hợp TikTok Lead Generation với Bitrix24 CRM

tạo chuoi tiktok :
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Xong dán vào env

chay docker:  docker compose up -d

tạo db tự động :
npm run db:generate

npm run db:migrate
npm run start: dev

http://localhost:3000/docs để test trên swagger

tạo file key titkok:

set SECRET=1830e364a4b724e65b110bdd9f2bb3d4c4959c9a280e94ff3d1b764bab80597e
node -e "const crypto=require('crypto'); const body=process.argv[1]; const secret=process.env.SECRET; console.log(crypto.createHmac('sha256', secret).update(body).digest('base64'));" "{\"event_id\":\"evt_1001\",\"lead_data\":{\"full_name\":\"Nguyen Van A\",\"email\":\"a@example.com\",\"phone\":\"+84901234567\"},\"campaign\":{\"campaign_id\":\"cmp_111\",\"ad_id\":\"ad_222\"}}"

cấu trúc:
flowchart LR
TT[TikTok Lead Gen] -->|Webhook| TTAPI[/POST /webhooks/tiktok/leads/]
TTAPI --> TikTokSvc[TikTokService] --> LeadsSvc[LeadsService]
LeadsSvc --> PG[(PostgreSQL)]

B24[Bitrix24] -->|Webhook| B24API[/POST /webhooks/bitrix24/deals/]
B24API --> DealsSvc[DealsService] --> PG

LeadsSvc --> Q[Redis/BullMQ Queue] --> Job[BitrixSyncProcessor] -->|REST| BitrixAPI[Bitrix24 API]

Analytics[AnalyticsService] --> PG
Exporter[ExporterService] --> PG

Docs[Swagger UI /docs] -.-> App[NestJS App]
Health[/GET /health/] -.-> App

NestJS modules: Leads, Deals, ConfigStore, Analytics, Exporter, Integrations(Bitrix), Jobs(BullMQ).
Data: PostgreSQL, Queue: Redis (BullMQ).
Webhooks: /webhooks/tiktok/leads, /webhooks/bitrix24/deals.
Docs/Health: /docs, /health.


Database ERD (commit kèm file .md/.png)
erDiagram
LEADS {
uuid id PK
varchar(128) external_id UK
varchar(32)  source
varchar(255) name
varchar(255) email
varchar(32)  phone
varchar(64)  campaign_id
varchar(64)  ad_id
jsonb        raw_data
int          bitrix24_id
varchar(32)  status
timestamp    created_at
timestamp    updated_at
}

DEALS {
uuid id PK
int          bitrix24_id
varchar(255) title
numeric(14,2) amount
varchar(8)   currency
varchar(64)  stage
int          probability
varchar(128) external_id UK
jsonb        raw_data
uuid         lead_id FK
timestamp    created_at
timestamp    updated_at
}

CONFIGURATIONS {
int id PK
varchar(64) key UK
jsonb       value
timestamp   updated_at
}

LEADS ||--o{ DEALS : "lead_id (nullable)"


3) Deployment guide (Docker) + Troubleshooting
   Cấu hình
docker-compose.yml gồm:
postgres:15 (port 5432:5432, volume data)
redis:7 (port 6379:6379)
.env (ví dụ):

NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=tiktok_b24
TIKTOK_WEBHOOK_SECRET=your_test_secret
SKIP_SIGNATURE_VERIFY=1


Nếu NestJS chạy trên host còn Postgres/Redis nằm trong Docker thì DB_HOST=localhost là 
đúng (vì bạn đã publish port)


Quy trình chạy
# 1) Khởi động hạ tầng
docker compose up -d

# 2) Cài deps & migrate DB
npm install
npm run db:migrate
# (có seeds thì chạy script seed của bạn)

# 3) Chạy app
npm run start:dev

# 4) Kiểm tra
open http://localhost:3000/health
open http://localhost:3000/docs


run test:
npm run test:e2e


limiter: { max: 40, duration: 1000 }, // 40 job/second
ở file bitrixSyncProcessor