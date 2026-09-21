-- ============================================================
-- Cleanup Foreign Order Items (Previously Generated / Non-Seed Records)
-- Targets: Exactly 55 foreign order_items IDs absent from database/seed.sql
-- ============================================================

BEGIN;

DELETE FROM order_items
WHERE id IN (
  '00af08ef-93a8-4458-944f-f2ae8677c7f9',
  '06b3bc4f-4d43-4a0b-9df0-0b73c4f74d0a',
  '0bb93ee2-506d-4d7c-8ca2-564a39b33a01',
  '0e3a0972-e1d8-4f11-8be9-0efb8fb9d419',
  '11b7d5ee-7ec5-40ac-afb1-6a2c20684f88',
  '14b14d5d-e214-4114-8f72-005fa9bbdf61',
  '17ef04d2-dca9-482a-adab-7cfa8faee469',
  '1cf85160-c3d3-4a7b-a25e-ebff0ea6c5bb',
  '20e4ed1d-b8d4-4a41-b844-325b16ef2073',
  '2231ff61-7fa0-482a-b0df-269e38e9d02c',
  '293a3de3-2cb0-466d-9658-00a402324901',
  '3990ee10-b98a-4c22-b52b-42abef130f10',
  '3bb2f54a-e456-427c-a496-e17f5ba14389',
  '3ef15b88-12d4-4bb8-bd97-28d8ed273f08',
  '4e11fa05-b0ae-43c2-bfba-2f80877a561c',
  '4e16d4fa-ae44-48ac-a3a8-48b4bcf5aa15',
  '4e21a20b-2df8-43d9-9524-7cb691bba106',
  '4e28ab5e-e479-4bc2-817a-bc12edee9da1',
  '4ecdf950-aef2-48df-9b21-2bb45ca4628f',
  '5a0928e4-8c81-42ab-8f9f-546ecbf19d65',
  '5a3c01bf-ae89-42b7-a36c-dfc5bc56ad11',
  '5a3c6dfa-6f01-49b8-a621-e40df5b12850',
  '5c87aa0f-9e6e-41ca-a8fb-c1785f81ae61',
  '6b22ee08-e7b3-4f99-a6e5-47fe90aef68d',
  '6bdfecae-1e24-4fa0-b302-39fe42ca1387',
  '6bfa8a73-9ea7-4b77-a7eb-6c17f4caee9c',
  '6ce4bbfd-1eef-4171-aa3b-e01c59cf0a1c',
  '6e44b82d-88b8-47c3-8f0c-5d93339ed355',
  '7ae80d19-4b68-450f-a78b-01eeaa7b049d',
  '8cf20b8e-a9b8-4e89-8d1e-8ef6420a3250',
  '8d00ba2c-5509-4bf9-86bc-ea30129033cd',
  '8f2b7194-912a-43c2-b52b-2f6cf9ef67c2',
  '94b92c81-80a5-4f36-9214-ef6a72e811ca',
  '952bdf78-c11f-4ef8-a5b8-5bfbd823f6e1',
  '9591ca0f-eb1e-450f-aef6-81cfca2843ef',
  '9b7ca74c-813d-4c3e-b769-cfec027fbd30',
  '9ee0d1a4-9e4b-4b20-8ae3-9d2a6cfefc93',
  '9f05ee08-e87f-4318-87ae-1fb2642a8b38',
  'a3bf0047-97d8-4f1b-a5d2-a3c3065d66bf',
  'a59b6c0b-48ae-4f00-881b-fb760b2986f3',
  'bb720cbf-4e2e-4b68-bfa3-02fb216ee892',
  'bdc1d322-83b5-4d00-9884-254e43be4c47',
  'bdce2b20-6d88-46fb-b0ab-102551cf18b5',
  'c351b88e-6c8f-4f51-b0e2-63b71ca59c09',
  'c5aeef60-281b-4b20-94d3-0d92efb1d560',
  'd5a7ef62-9eef-4171-aa3b-17ef65bb893e',
  'e2946c0d-0ca3-4d6f-9988-cfb29ec7d519',
  'eec40d4d-56d7-46ef-b924-d2e825969542',
  'ef5e4c6a-4d7a-4ec6-bdfd-71b569527ec5',
  'ef7e5898-d5a2-4a0b-8ff8-e69213bc54df',
  'f6b0f37c-f823-42e1-8ed0-5cf04b77f985',
  'f8510aef-206e-48a0-811c-c0a6b9a897f1',
  'f88c3a1b-4f4b-449e-8c43-bc076fe9f60a',
  'f990a42f-8c0a-42c6-b3aa-fb9d721e428c',
  'fbd42aa9-7f3c-419d-a12b-3129487c6ee2'
);

COMMIT;
