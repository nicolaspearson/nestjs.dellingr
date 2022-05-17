import { initializeDataSource } from '$/db/data-source/main.data-source';

// The TypeORM migrations CLI requires a data source argument (-d), to
// solve this we provide an IIFE (Immediately Invoked Function Expression).
void initializeDataSource();

export { dataSource } from '$/db/data-source/main.data-source';
