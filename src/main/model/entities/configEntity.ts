import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 64, unique: true }) key: string; // 'field_mapping' | 'deal_rules'
  @Column({ type: 'jsonb' }) value: any;
  @UpdateDateColumn() updated_at: Date;
}
