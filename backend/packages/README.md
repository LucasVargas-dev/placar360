# Packages - Default Structure

Esta pasta contém a estrutura base (default) para criação de entidades na aplicação.

## 📁 Estrutura

```
packages/
├── default.controller.ts    # Controller base
├── default.service.ts       # Service base
├── default.orm.ts          # ORM base
├── default.entity.ts       # Entidade base
├── defaultQuery.service.ts # Query service base
├── common/                 # Utilitários comuns
│   ├── decorators/
│   └── pipes/
└── utils/                  # Tipos e schemas
    ├── types/
    └── schemas/
```

## 🚀 Como Usar

### 1. Criar o ORM

```typescript
// person.orm.ts
import ORM from '../../packages/default.orm.js';
import { PrismaModel } from '../../types/prismaModel.js';
import DefaultEntity from '../../packages/defaultEntity.js';

export interface PersonEntity extends Person, DefaultEntity {}

export class PersonORM extends ORM<PersonEntity> {
	getModelName(): PrismaModel {
		return 'person';
	}

	isGeneral(): boolean {
		return false;
	}
}
```

### 2. Criar o Service

```typescript
// person.service.new.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import DefaultService from '../../packages/default.service.js';
import { PersonEntity, PersonORM } from './person.orm.js';
import { CreatePersonDto, UpdatePersonDto } from './person.model';
import DefaultQueryService from '../../packages/defaultQuery.service.js';
import { z } from 'zod';
import { PrismaModel } from '../../types/prismaModel.js';

@Injectable()
export class PersonServiceNew extends DefaultService<
	PersonEntity,
	CreatePersonDto,
	UpdatePersonDto
> {
	constructor() {
		const orm = new PersonORM();
		const queryService = new DefaultQueryService<PersonEntity>(orm);
		super(orm, queryService);
	}

	protected async validateEntity(data: CreatePersonDto | UpdatePersonDto, id?: number): Promise<void> {
		// Sua validação customizada
	}

	protected async validateId(id: number): Promise<void> {
		const person = await this.show(id);
		if (!person) {
			throw new NotFoundException(`Person with ID ${id} not found`);
		}
	}

	protected createSchema() {
		return z.object({
			name: z.string().min(1),
			email: z.string().email().optional().nullable(),
		});
	}

	protected updateSchema() {
		return z.object({
			name: z.string().min(1).optional(),
			email: z.string().email().optional().nullable(),
		});
	}
}
```

### 3. Criar o Controller

```typescript
// person.controller.new.ts
import { Controller } from '@nestjs/common';
import { PersonServiceNew } from './person.service.new';
import DefaultController from '../../packages/default.controller.js';
import { PersonEntity } from './person.orm.js';
import { CreatePersonDto, UpdatePersonDto } from './person.model';
import { ZodSchema } from 'zod';
import { z } from 'zod';

@Controller('persons-new')
export class PersonControllerNew extends DefaultController<
	PersonEntity,
	CreatePersonDto,
	UpdatePersonDto
> {
	constructor(private readonly personService: PersonServiceNew) {
		super(personService);
	}

	protected createSchema(): ZodSchema {
		return z.object({
			name: z.string().min(1),
			email: z.string().email().optional().nullable(),
		});
	}

	protected updateSchema(): ZodSchema {
		return z.object({
			name: z.string().min(1).optional(),
			email: z.string().email().optional().nullable(),
		});
	}
}
```

## ✨ Recursos Disponíveis

### Endpoints Automáticos

- `GET /resource` - Lista todos (com paginação se passar `page` e `limit`)
- `GET /resource/:id` - Busca por ID
- `POST /resource` - Cria novo
- `PUT /resource/:id` - Atualiza
- `DELETE /resource/:id` - Deleta permanentemente
- `PATCH /resource/soft-delete/:id` - Soft delete

### Hooks Disponíveis

**Service:**
- `beforeCreate(data)` - Antes de criar
- `afterCreate(data, entity)` - Depois de criar
- `beforeUpdate(data)` - Antes de atualizar
- `afterUpdate(data, entity)` - Depois de atualizar
- `beforeDelete(id)` - Antes de deletar
- `afterDelete(id)` - Depois de deletar
- `validateEntity(data, id?)` - Validação customizada
- `parseData(data)` - Transformação de dados

## 🔧 Requisitos

1. Todos os models precisam ter campos `deletedAt`, `createdAt`, `updatedAt` no Prisma
2. Implementar `createSchema()` e `updateSchema()` usando Zod
3. Implementar `validateEntity()` e `validateId()`
4. Usar transações do `@nestjs-cls/transactional`

