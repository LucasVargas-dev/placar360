/**
 * Default Entity Base Class
 * All entities should extend this base class
 */
// export default interface DefaultEntity {
//   id: number | string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;

//   constructor(partial?: Partial<DefaultEntity>) {
//     Object.assign(this, partial);
//   }
// }

export default interface DefaultEntity {
	id: number | string;
	[key: string]: any;
}

