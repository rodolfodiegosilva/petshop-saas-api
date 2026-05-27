import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialPetshopSaasSchema1760000000000 implements MigrationInterface {
  name = 'InitialPetshopSaasSchema1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tenants (
        id varchar(36) NOT NULL,
        name varchar(150) NOT NULL,
        slug varchar(100) NOT NULL,
        api_key varchar(150) NOT NULL,
        is_active tinyint NOT NULL DEFAULT 1,
        allowed_domains json NULL,
        branding_config json NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_tenants_slug (slug),
        UNIQUE INDEX IDX_tenants_api_key (api_key),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id varchar(36) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(150) NOT NULL,
        cpf varchar(14) NOT NULL,
        phone varchar(20) NOT NULL,
        neighborhood varchar(100) NULL,
        city varchar(50) NULL,
        role enum('client','veterinarian','admin') NOT NULL DEFAULT 'client',
        is_active tinyint NOT NULL DEFAULT 1,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_users_tenant_email (tenant_id, email),
        UNIQUE INDEX IDX_users_tenant_cpf (tenant_id, cpf),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE pets (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        species varchar(50) NOT NULL,
        sex enum('Macho','Fêmea','Não informado') NOT NULL DEFAULT 'Não informado',
        breed varchar(100) NOT NULL,
        age varchar(50) NOT NULL,
        weight decimal(5,2) NOT NULL,
        avatar varchar(10) NOT NULL,
        observation text NULL,
        vaccines json NULL,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        tutor_id varchar(36) NOT NULL,
        INDEX IDX_pets_tenant_tutor (tenant_id, tutor_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE veterinarians (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(150) NOT NULL,
        crmv varchar(20) NOT NULL,
        specialty varchar(100) NOT NULL,
        shift enum('Diurno','Noturno','Integral') NOT NULL DEFAULT 'Diurno',
        status enum('Disponível','Últimas vagas','Agenda cheia') NOT NULL DEFAULT 'Disponível',
        is_active tinyint NOT NULL DEFAULT 1,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        UNIQUE INDEX IDX_vets_tenant_crmv (tenant_id, crmv),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE products (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(150) NOT NULL,
        category enum('Cães','Gatos','Peixes','Aves','Répteis','Pequenos Pets') NOT NULL,
        price decimal(10,2) NOT NULL,
        original_price decimal(10,2) NULL,
        rating decimal(2,1) NOT NULL DEFAULT 5.0,
        image_bg varchar(150) NULL,
        image_emoji varchar(10) NULL,
        description text NOT NULL,
        stock int NOT NULL DEFAULT 0,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        deleted_at datetime(6) NULL,
        INDEX IDX_products_tenant_category (tenant_id, category),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE subscription_plans (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(50) NOT NULL,
        price decimal(10,2) NOT NULL,
        pet_limit int NOT NULL DEFAULT 1,
        store_discount decimal(4,2) NOT NULL DEFAULT 0.00,
        free_baths_per_month int NOT NULL DEFAULT 0,
        is_active tinyint NOT NULL DEFAULT 1,
        tenant_id varchar(36) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_plans_tenant_name (tenant_id, name),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE user_subscriptions (
        id varchar(36) NOT NULL,
        user_id varchar(36) NOT NULL,
        plan_id int NOT NULL,
        status enum('active','suspended','cancelled','past_due') NOT NULL DEFAULT 'active',
        start_date date NOT NULL,
        next_billing_date date NOT NULL,
        payment_method enum('credit_card','pix','boleto') NOT NULL,
        tenant_id varchar(36) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_subs_tenant_user (tenant_id, user_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE appointments (
        id int NOT NULL AUTO_INCREMENT,
        type enum('Serviço','Táxi Pet') NOT NULL,
        service varchar(100) NOT NULL,
        date date NOT NULL,
        time varchar(5) NOT NULL,
        status enum('Confirmado','Em análise','Concluído','Cancelado') NOT NULL DEFAULT 'Em análise',
        location varchar(150) NOT NULL,
        pickup_address varchar(250) NULL,
        destination_address varchar(250) NULL,
        transport_mode enum('Somente ida','Ida e volta') NULL,
        companion enum('Tutor acompanha','Pet desacompanhado') NULL,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        pet_id int NOT NULL,
        tutor_id varchar(36) NOT NULL,
        veterinarian_id int NULL,
        INDEX IDX_appointments_tenant_date (tenant_id, date),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE medical_records (
        id int NOT NULL AUTO_INCREMENT,
        record_date datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        diagnosis text NOT NULL,
        prescription text NOT NULL,
        return_window varchar(100) NOT NULL,
        status enum('Estável','Atenção','Em tratamento') NOT NULL DEFAULT 'Estável',
        symptoms text NOT NULL,
        clinical_notes text NOT NULL,
        exams_requested json NULL,
        recommendations json NULL,
        prescription_items json NULL,
        tenant_id varchar(36) NOT NULL,
        pet_id int NOT NULL,
        veterinarian_id int NOT NULL,
        INDEX IDX_records_tenant_pet (tenant_id, pet_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE orders (
        id varchar(36) NOT NULL,
        number varchar(50) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        status enum('Separando','Entregue','Pronto para retirada','Cancelado') NOT NULL DEFAULT 'Separando',
        total decimal(10,2) NOT NULL,
        tenant_id varchar(36) NOT NULL,
        metadata json NULL,
        user_id varchar(36) NOT NULL,
        UNIQUE INDEX IDX_orders_tenant_number (tenant_id, number),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE order_items (
        id int NOT NULL AUTO_INCREMENT,
        order_id varchar(36) NOT NULL,
        product_id int NOT NULL,
        quantity int NOT NULL,
        price decimal(10,2) NOT NULL,
        tenant_id varchar(36) NOT NULL,
        INDEX IDX_order_items_tenant_order (tenant_id, order_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE stock_movements (
        id int NOT NULL AUTO_INCREMENT,
        product_id int NOT NULL,
        user_id varchar(36) NULL,
        quantity int NOT NULL,
        type enum('sale','cancellation_return','manual_adjustment','replenishment','loss') NOT NULL,
        reason varchar(250) NULL,
        tenant_id varchar(36) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX IDX_stock_tenant_product (tenant_id, product_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE payment_transactions (
        id varchar(36) NOT NULL,
        order_id varchar(36) NOT NULL,
        user_id varchar(36) NOT NULL,
        gateway_transaction_id varchar(150) NOT NULL,
        payment_method enum('pix','credit_card','boleto') NOT NULL,
        amount decimal(10,2) NOT NULL,
        status enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
        gateway_payload json NULL,
        tenant_id varchar(36) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_payments_tenant_gateway (tenant_id, gateway_transaction_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE feature_flags (
        id int NOT NULL AUTO_INCREMENT,
        \`key\` varchar(100) NOT NULL,
        description varchar(250) NOT NULL,
        is_enabled tinyint NOT NULL DEFAULT 1,
        rules json NULL,
        tenant_id varchar(36) NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_flags_tenant_key (tenant_id, \`key\`),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`ALTER TABLE pets ADD CONSTRAINT FK_pets_tutor FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE user_subscriptions ADD CONSTRAINT FK_subs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE user_subscriptions ADD CONSTRAINT FK_subs_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE RESTRICT`);
    await queryRunner.query(`ALTER TABLE appointments ADD CONSTRAINT FK_appointments_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE appointments ADD CONSTRAINT FK_appointments_tutor FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE appointments ADD CONSTRAINT FK_appointments_vet FOREIGN KEY (veterinarian_id) REFERENCES veterinarians(id) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE medical_records ADD CONSTRAINT FK_records_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE medical_records ADD CONSTRAINT FK_records_vet FOREIGN KEY (veterinarian_id) REFERENCES veterinarians(id) ON DELETE RESTRICT`);
    await queryRunner.query(`ALTER TABLE orders ADD CONSTRAINT FK_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE order_items ADD CONSTRAINT FK_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE order_items ADD CONSTRAINT FK_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT`);
    await queryRunner.query(`ALTER TABLE stock_movements ADD CONSTRAINT FK_stock_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE stock_movements ADD CONSTRAINT FK_stock_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE payment_transactions ADD CONSTRAINT FK_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE payment_transactions ADD CONSTRAINT FK_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE payment_transactions`);
    await queryRunner.query(`DROP TABLE stock_movements`);
    await queryRunner.query(`DROP TABLE order_items`);
    await queryRunner.query(`DROP TABLE orders`);
    await queryRunner.query(`DROP TABLE medical_records`);
    await queryRunner.query(`DROP TABLE appointments`);
    await queryRunner.query(`DROP TABLE user_subscriptions`);
    await queryRunner.query(`DROP TABLE subscription_plans`);
    await queryRunner.query(`DROP TABLE products`);
    await queryRunner.query(`DROP TABLE veterinarians`);
    await queryRunner.query(`DROP TABLE pets`);
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TABLE feature_flags`);
    await queryRunner.query(`DROP TABLE tenants`);
  }
}
