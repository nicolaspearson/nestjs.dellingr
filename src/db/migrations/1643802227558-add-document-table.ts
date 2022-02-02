import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDocumentTable1643802227558 implements MigrationInterface {
  name = 'addDocumentTable1643802227558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "document" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "transaction_uuid" uuid NOT NULL, CONSTRAINT "PK_8960855240f8a386eed1d7791c1" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_DOCUMENT_TRANSACTION_UUID" ON "document" ("transaction_uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_1d9a491b710332b09c31079dcb1" FOREIGN KEY ("transaction_uuid") REFERENCES "transaction"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_1d9a491b710332b09c31079dcb1"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_DOCUMENT_TRANSACTION_UUID"`);
    await queryRunner.query(`DROP TABLE "document"`);
  }
}
