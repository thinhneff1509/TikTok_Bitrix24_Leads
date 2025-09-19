import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,
    UpdateDateColumn, JoinColumn, Index
} from 'typeorm';
import { LeadEntity } from './leadEntity';

// transfer numeric/decimal to number
class ColumnNumericTransformer {
    to(value?: number | null): number | null | undefined { return value as any; }
    from(value?: string | null): number | null | undefined {
        return typeof value === 'string' ? Number(value) : (value as any);
    }
}

@Entity('deals')
export class DealEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => LeadEntity, { eager: true, nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lead_id' })
    lead?: LeadEntity | null;

    @Column({ type: 'int', nullable: true })
    bitrix24_id?: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    amount?: number | null;

    @Column({ type: 'varchar', length: 8, default: 'VND' })
    currency: string;

    @Column({ type: 'varchar', length: 64, nullable: true })
    stage?: string;

    @Column({ type: 'int', default: 0 })
    probability: number;

    @Index({ unique: true })                 //upsert
    @Column({ type: 'varchar', length: 128 })
    external_id: string;

    @Column({ type: 'jsonb', nullable: true })
    raw_data?: Record<string, any>;

    @CreateDateColumn() created_at: Date;

    @UpdateDateColumn() updated_at: Date;
}

