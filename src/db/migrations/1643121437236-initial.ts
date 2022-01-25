import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1643121437236 implements MigrationInterface {
  name = 'initial1643121437236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_USER_EMAIL" ON "user" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "public"."wallet" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" integer NOT NULL DEFAULT '0', "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_uuid" uuid NOT NULL, CONSTRAINT "REL_d44c02834d8af54411970a1c01" UNIQUE ("user_uuid"), CONSTRAINT "PK_ac5b822bf9c91fe42b32f804c2f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_WALLET_USER_UUID" ON "public"."wallet" ("user_uuid") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_state_enum" AS ENUM('pending', 'processed', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('credit', 'debit')`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."transaction" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL DEFAULT '0', "reference" character varying NOT NULL, "state" "public"."transaction_state_enum" NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "wallet_uuid" uuid NOT NULL, CONSTRAINT "PK_fcce0ce5cc7762e90d2cc7e2307" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_TX_STATE" ON "public"."transaction" ("state") `);
    await queryRunner.query(`CREATE INDEX "IDX_TX_TYPE" ON "public"."transaction" ("type") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_TRANSACTION_WALLET_UUID" ON "public"."transaction" ("wallet_uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."wallet" ADD CONSTRAINT "FK_d44c02834d8af54411970a1c017" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."transaction" ADD CONSTRAINT "FK_861a9c63c62a2a0ce6c3d7fc7a7" FOREIGN KEY ("wallet_uuid") REFERENCES "public"."wallet"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."transaction" DROP CONSTRAINT "FK_861a9c63c62a2a0ce6c3d7fc7a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."wallet" DROP CONSTRAINT "FK_d44c02834d8af54411970a1c017"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_TRANSACTION_WALLET_UUID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_TX_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_TX_STATE"`);
    await queryRunner.query(`DROP TABLE "public"."transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_state_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_WALLET_USER_UUID"`);
    await queryRunner.query(`DROP TABLE "public"."wallet"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
    await queryRunner.query(`DROP TABLE "public"."user"`);
  }
}
