import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Transaction from './transaction.entity';

@Entity({ name: 'document' })
export default class Document implements Api.Entities.Document {
  @PrimaryGeneratedColumn('uuid')
  uuid!: Uuid;

  @Column()
  key!: string;

  @Column()
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone' })
  updatedAt?: Date;

  @ManyToOne((_) => Transaction, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'transaction_uuid' })
  @Index('IDX_DOCUMENT_TRANSACTION_UUID')
  transaction!: Transaction;
}
