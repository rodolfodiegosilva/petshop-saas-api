import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPetshopSaasSchema1779850258470 implements MigrationInterface {
    name = 'InitialPetshopSaasSchema1779850258470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`medical_records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`record_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`diagnosis\` text NOT NULL, \`prescription\` text NOT NULL, \`return_window\` varchar(100) NOT NULL, \`status\` enum ('Estável', 'Atenção', 'Em tratamento') NOT NULL DEFAULT 'Estável', \`symptoms\` text NOT NULL, \`clinical_notes\` text NOT NULL, \`exams_requested\` json NULL, \`recommendations\` json NULL, \`prescription_items\` json NULL, \`tenant_id\` varchar(36) NOT NULL, \`pet_id\` int NOT NULL, \`veterinarian_id\` int NOT NULL, INDEX \`IDX_93b786a3d18d7815d5f089e38f\` (\`tenant_id\`, \`pet_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`category\` enum ('Cães', 'Gatos', 'Peixes', 'Aves', 'Répteis', 'Pequenos Pets') NOT NULL, \`price\` decimal(10,2) NOT NULL, \`original_price\` decimal(10,2) NULL, \`rating\` decimal(2,1) NOT NULL DEFAULT '5.0', \`image_bg\` varchar(150) NULL, \`image_emoji\` varchar(10) NULL, \`description\` text NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_bd0037f63dd2ac718c2f475fd5\` (\`tenant_id\`, \`category\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` varchar(36) NOT NULL, \`product_id\` int NOT NULL, \`quantity\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, \`tenant_id\` varchar(36) NOT NULL, INDEX \`IDX_130af2b40e6c3d2b7fa6a80254\` (\`tenant_id\`, \`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`number\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('Separando', 'Entregue', 'Pronto para retirada', 'Cancelado') NOT NULL DEFAULT 'Separando', \`total\` decimal(10,2) NOT NULL, \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, \`user_id\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_9a7fc95827448ad9f528fce835\` (\`tenant_id\`, \`number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscription_plans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`pet_limit\` int NOT NULL DEFAULT '1', \`store_discount\` decimal(4,2) NOT NULL DEFAULT '0.00', \`free_baths_per_month\` int NOT NULL DEFAULT '0', \`is_active\` tinyint NOT NULL DEFAULT 1, \`tenant_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_35887fe3eaea03b5bc77502e26\` (\`tenant_id\`, \`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_subscriptions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`plan_id\` int NOT NULL, \`status\` enum ('active', 'suspended', 'cancelled', 'past_due') NOT NULL DEFAULT 'active', \`start_date\` date NOT NULL, \`next_billing_date\` date NOT NULL, \`payment_method\` enum ('credit_card', 'pix', 'boleto') NOT NULL, \`tenant_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9b783ede9fe136a8b04f023318\` (\`tenant_id\`, \`user_id\`), UNIQUE INDEX \`REL_0641da02314913e28f6131310e\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(150) NOT NULL, \`cpf\` varchar(14) NOT NULL, \`phone\` varchar(20) NOT NULL, \`neighborhood\` varchar(100) NULL, \`city\` varchar(50) NULL, \`role\` enum ('client', 'veterinarian', 'admin') NOT NULL DEFAULT 'client', \`is_active\` tinyint NOT NULL DEFAULT 1, \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2c4608f4892b4fc401231db346\` (\`tenant_id\`, \`cpf\`), UNIQUE INDEX \`IDX_e9f4c2efab52114c4e99e28efb\` (\`tenant_id\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`species\` varchar(50) NOT NULL, \`sex\` enum ('Macho', 'Fêmea', 'Não informado') NOT NULL DEFAULT 'Não informado', \`breed\` varchar(100) NOT NULL, \`age\` varchar(50) NOT NULL, \`weight\` decimal(5,2) NOT NULL, \`avatar\` varchar(10) NOT NULL, \`observation\` text NULL, \`vaccines\` json NULL, \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, \`tutor_id\` varchar(36) NOT NULL, INDEX \`IDX_8b7273f331a16f0dcb8983e8da\` (\`tenant_id\`, \`tutor_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('Serviço', 'Táxi Pet') NOT NULL, \`service\` varchar(100) NOT NULL, \`date\` date NOT NULL, \`time\` varchar(5) NOT NULL, \`status\` enum ('Confirmado', 'Em análise', 'Concluído', 'Cancelado') NOT NULL DEFAULT 'Em análise', \`location\` varchar(150) NOT NULL, \`pickup_address\` varchar(250) NULL, \`destination_address\` varchar(250) NULL, \`transport_mode\` enum ('Somente ida', 'Ida e volta') NULL, \`companion\` enum ('Tutor acompanha', 'Pet desacompanhado') NULL, \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, \`pet_id\` int NOT NULL, \`tutor_id\` varchar(36) NOT NULL, \`veterinarian_id\` int NULL, INDEX \`IDX_f3eb0849e81700c10a3bab2940\` (\`tenant_id\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`veterinarians\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`crmv\` varchar(20) NOT NULL, \`specialty\` varchar(100) NOT NULL, \`shift\` enum ('Diurno', 'Noturno', 'Integral') NOT NULL DEFAULT 'Diurno', \`status\` enum ('Disponível', 'Últimas vagas', 'Agenda cheia') NOT NULL DEFAULT 'Disponível', \`is_active\` tinyint NOT NULL DEFAULT 1, \`tenant_id\` varchar(36) NOT NULL, \`metadata\` json NULL, UNIQUE INDEX \`IDX_2d43f67507eecbe379d0bfc6b4\` (\`tenant_id\`, \`crmv\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tenants\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(150) NOT NULL, \`slug\` varchar(100) NOT NULL, \`api_key\` varchar(150) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`allowed_domains\` json NULL, \`branding_config\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2310ecc5cb8be427097154b18f\` (\`slug\`), UNIQUE INDEX \`IDX_b72fd6a5bc2b69134a6ae7a558\` (\`api_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_movements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`user_id\` varchar(36) NULL, \`quantity\` int NOT NULL, \`type\` enum ('sale', 'cancellation_return', 'manual_adjustment', 'replenishment', 'loss') NOT NULL, \`reason\` varchar(250) NULL, \`tenant_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_c37ac3ccd4233a075517e77811\` (\`tenant_id\`, \`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_transactions\` (\`id\` varchar(36) NOT NULL, \`order_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`gateway_transaction_id\` varchar(150) NOT NULL, \`payment_method\` enum ('pix', 'credit_card', 'boleto') NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`status\` enum ('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending', \`gateway_payload\` json NULL, \`tenant_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f9e5791815e9ce7a5b72f55ca7\` (\`tenant_id\`, \`gateway_transaction_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`feature_flags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(100) NOT NULL, \`description\` varchar(250) NOT NULL, \`is_enabled\` tinyint NOT NULL DEFAULT 1, \`rules\` json NULL, \`tenant_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9c48f720ffe205d5965c3505cd\` (\`tenant_id\`, \`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`medical_records\` ADD CONSTRAINT \`FK_00f48fa86cd43404c7c3f1cf691\` FOREIGN KEY (\`pet_id\`) REFERENCES \`pets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medical_records\` ADD CONSTRAINT \`FK_76de7b6fc662bd9b2777f7696a4\` FOREIGN KEY (\`veterinarian_id\`) REFERENCES \`veterinarians\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_9263386c35b6b242540f9493b00\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_subscriptions\` ADD CONSTRAINT \`FK_0641da02314913e28f6131310eb\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_subscriptions\` ADD CONSTRAINT \`FK_fe0520c7b2c1c5792446086491f\` FOREIGN KEY (\`plan_id\`) REFERENCES \`subscription_plans\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pets\` ADD CONSTRAINT \`FK_eb990a74dbc1c946095cba08d38\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_47439f4739409e7e27f2e5444d5\` FOREIGN KEY (\`pet_id\`) REFERENCES \`pets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_f131605d5da8cd08df04770e697\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_928986ec679d42f78b139bff0f5\` FOREIGN KEY (\`veterinarian_id\`) REFERENCES \`veterinarians\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movements\` ADD CONSTRAINT \`FK_2c1bb05b80ddcc562cd28d826c6\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movements\` ADD CONSTRAINT \`FK_d7fedfd6ee0f4a06648c48631c6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_transactions\` ADD CONSTRAINT \`FK_0f581511ac19ecb02dab437cd41\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_transactions\` ADD CONSTRAINT \`FK_77fab0556decc83a81a5bf8c25d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_transactions\` DROP FOREIGN KEY \`FK_77fab0556decc83a81a5bf8c25d\``);
        await queryRunner.query(`ALTER TABLE \`payment_transactions\` DROP FOREIGN KEY \`FK_0f581511ac19ecb02dab437cd41\``);
        await queryRunner.query(`ALTER TABLE \`stock_movements\` DROP FOREIGN KEY \`FK_d7fedfd6ee0f4a06648c48631c6\``);
        await queryRunner.query(`ALTER TABLE \`stock_movements\` DROP FOREIGN KEY \`FK_2c1bb05b80ddcc562cd28d826c6\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_928986ec679d42f78b139bff0f5\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_f131605d5da8cd08df04770e697\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_47439f4739409e7e27f2e5444d5\``);
        await queryRunner.query(`ALTER TABLE \`pets\` DROP FOREIGN KEY \`FK_eb990a74dbc1c946095cba08d38\``);
        await queryRunner.query(`ALTER TABLE \`user_subscriptions\` DROP FOREIGN KEY \`FK_fe0520c7b2c1c5792446086491f\``);
        await queryRunner.query(`ALTER TABLE \`user_subscriptions\` DROP FOREIGN KEY \`FK_0641da02314913e28f6131310eb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_9263386c35b6b242540f9493b00\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`medical_records\` DROP FOREIGN KEY \`FK_76de7b6fc662bd9b2777f7696a4\``);
        await queryRunner.query(`ALTER TABLE \`medical_records\` DROP FOREIGN KEY \`FK_00f48fa86cd43404c7c3f1cf691\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c48f720ffe205d5965c3505cd\` ON \`feature_flags\``);
        await queryRunner.query(`DROP TABLE \`feature_flags\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9e5791815e9ce7a5b72f55ca7\` ON \`payment_transactions\``);
        await queryRunner.query(`DROP TABLE \`payment_transactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_c37ac3ccd4233a075517e77811\` ON \`stock_movements\``);
        await queryRunner.query(`DROP TABLE \`stock_movements\``);
        await queryRunner.query(`DROP INDEX \`IDX_b72fd6a5bc2b69134a6ae7a558\` ON \`tenants\``);
        await queryRunner.query(`DROP INDEX \`IDX_2310ecc5cb8be427097154b18f\` ON \`tenants\``);
        await queryRunner.query(`DROP TABLE \`tenants\``);
        await queryRunner.query(`DROP INDEX \`IDX_2d43f67507eecbe379d0bfc6b4\` ON \`veterinarians\``);
        await queryRunner.query(`DROP TABLE \`veterinarians\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3eb0849e81700c10a3bab2940\` ON \`appointments\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b7273f331a16f0dcb8983e8da\` ON \`pets\``);
        await queryRunner.query(`DROP TABLE \`pets\``);
        await queryRunner.query(`DROP INDEX \`IDX_e9f4c2efab52114c4e99e28efb\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c4608f4892b4fc401231db346\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_0641da02314913e28f6131310e\` ON \`user_subscriptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b783ede9fe136a8b04f023318\` ON \`user_subscriptions\``);
        await queryRunner.query(`DROP TABLE \`user_subscriptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_35887fe3eaea03b5bc77502e26\` ON \`subscription_plans\``);
        await queryRunner.query(`DROP TABLE \`subscription_plans\``);
        await queryRunner.query(`DROP INDEX \`IDX_9a7fc95827448ad9f528fce835\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_130af2b40e6c3d2b7fa6a80254\` ON \`order_items\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd0037f63dd2ac718c2f475fd5\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_93b786a3d18d7815d5f089e38f\` ON \`medical_records\``);
        await queryRunner.query(`DROP TABLE \`medical_records\``);
    }

}
