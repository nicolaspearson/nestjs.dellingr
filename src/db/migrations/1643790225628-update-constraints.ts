import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateConstraints1643790225628 implements MigrationInterface {
  name = 'test1643790225628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_WALLET_USER_UUID"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_d44c02834d8af54411970a1c017"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "REL_d44c02834d8af54411970a1c01"`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_WALLET_USER_UUID" ON "wallet" ("user_uuid") `);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_d44c02834d8af54411970a1c017" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_d44c02834d8af54411970a1c017"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_WALLET_USER_UUID"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "REL_d44c02834d8af54411970a1c01" UNIQUE ("user_uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_d44c02834d8af54411970a1c017" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_WALLET_USER_UUID" ON "wallet" ("user_uuid") `,
    );
  }
}
