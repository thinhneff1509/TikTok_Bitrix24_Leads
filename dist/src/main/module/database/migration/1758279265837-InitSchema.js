"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1758279265837 = void 0;
class InitSchema1758279265837 {
    name = 'InitSchema1758279265837';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "leads" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "external_id" character varying(128) NOT NULL,
                "source" character varying(32) NOT NULL DEFAULT 'tiktok',
                "name" character varying(255) NOT NULL,
                "email" character varying(255),
                "phone" character varying(32),
                "campaign_id" character varying(64),
                "ad_id" character varying(64),
                "raw_data" jsonb,
                "bitrix24_id" integer,
                "status" character varying(32) NOT NULL DEFAULT 'new',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e7647322c0726d9c81b926b8f6" ON "leads" ("external_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b3eea7add0e16594dba102716c" ON "leads" ("email")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_42ebb4366d014febbcfdef39e3" ON "leads" ("phone")
        `);
        await queryRunner.query(`
            CREATE TABLE "deals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "bitrix24_id" integer,
                "title" character varying(255) NOT NULL,
                "amount" numeric(14, 2),
                "currency" character varying(8) NOT NULL DEFAULT 'VND',
                "stage" character varying(64),
                "probability" integer NOT NULL DEFAULT '0',
                "external_id" character varying(128) NOT NULL,
                "raw_data" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "lead_id" uuid,
                CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_de03d1fdca4bd56c5e091e4fd3" ON "deals" ("external_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "configurations" (
                "id" SERIAL NOT NULL,
                "key" character varying(64) NOT NULL,
                "value" jsonb NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_3c658898252e3694655de8a07e7" UNIQUE ("key"),
                CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "deals"
            ADD CONSTRAINT "FK_96b51475f76f01c135ecdc968dc" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "deals" DROP CONSTRAINT "FK_96b51475f76f01c135ecdc968dc"
        `);
        await queryRunner.query(`
            DROP TABLE "configurations"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_de03d1fdca4bd56c5e091e4fd3"
        `);
        await queryRunner.query(`
            DROP TABLE "deals"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_42ebb4366d014febbcfdef39e3"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b3eea7add0e16594dba102716c"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e7647322c0726d9c81b926b8f6"
        `);
        await queryRunner.query(`
            DROP TABLE "leads"
        `);
    }
}
exports.InitSchema1758279265837 = InitSchema1758279265837;
//# sourceMappingURL=1758279265837-InitSchema.js.map