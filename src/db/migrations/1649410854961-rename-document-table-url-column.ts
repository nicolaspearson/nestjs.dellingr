import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDocumentTableUrlColumn1649410854961 implements MigrationInterface {
  name = 'renameDocumentTableUrlColumn1649410854961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "url" TO "key"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "key" TO "url"`);
  }
}
