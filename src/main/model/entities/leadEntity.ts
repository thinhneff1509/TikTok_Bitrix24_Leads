import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leads')
export class LeadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) // hỗ trợ upsert theo event_id
  @Column({ type: 'varchar', length: 128 })
  external_id: string; // TikTok event_id hoặc lead id

  @Column({ type: 'varchar', length: 32, default: 'tiktok' })
  source: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Index()
  @Column({ type: 'varchar', length: 32, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  campaign_id?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ad_id?: string;

  @Column({ type: 'jsonb', nullable: true })
  raw_data?: any;

  @Column({ type: 'int', nullable: true })
  bitrix24_id?: number;

  @Column({ type: 'varchar', length: 32, default: 'new' })
  status: string;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
