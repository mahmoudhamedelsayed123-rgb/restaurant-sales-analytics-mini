-- ============================================================
-- Cleanup Foreign Orders (Previously Generated / Non-Seed Records)
-- Targets: Exactly 34 foreign orders IDs absent from database/seed.sql
-- ============================================================

BEGIN;

DELETE FROM orders
WHERE id IN (
  '0bb8fcf5-9fd4-4d89-b1ff-ea675cf39af4',
  '20572242-70b1-42e1-8ed0-5db59ad6d34e',
  '20e7df65-1d02-49aa-a185-3be1131c7717',
  '3ca12658-0520-410e-8fbf-bfb42605ebed',
  '478e907a-d5ba-4ef3-91e8-63bb3ab107eb',
  '4d6fec62-be9d-4be7-aa2a-e908cb3c6601',
  '4e88b8e0-cb83-4a6c-9494-df7bb4787a7e',
  '52fdf378-cf52-4fe8-b7ca-bf31ce8677c7',
  '5a4204b7-d1cb-4e92-a165-27a928ed9ac7',
  '5a66a1ab-5d7a-4221-83ca-cf74a3f36e4f',
  '6b251214-72ae-4c74-a035-71578f72c3d9',
  '6b2b73ee-3f62-4217-a065-ae1fcce1fa40',
  '919b1686-2fc0-4dca-8302-8aa02c2e0b11',
  '935ebec1-ef46-4cb3-afef-ddb9f3fa0e6b',
  '95932599-2cd1-4ea6-8968-07bf93ce0a3e',
  '95e8eef8-cda6-46b0-ad92-be22818c32ec',
  '9bbf463b-31d7-46ef-b924-118804c71850',
  'a59e19d1-81d3-4f9e-a896-1bc0657956fe',
  'b0838e12-c2cb-45ca-a89e-018dfb69edb6',
  'bc86e098-9ef4-4f24-be23-5e937d90eb11',
  'bfe7ec1c-c7fc-4ff5-ae53-bd3a060bd3d7',
  'cb0a90e3-6a58-4ee4-90ff-4e782be17724',
  'cbddcae4-e3a1-4fd2-8980-60b64be165a2',
  'cf95f464-96fe-4d76-8f24-2c49c71ea407',
  'd5089201-ac81-4b10-a2ea-9e7514330ad3',
  'ddf26c71-33e3-4bbf-bc54-e0b4e2a865b4',
  'e3bcf418-2e0e-4f05-897e-1a6a5e1288c3',
  'e3ed286b-a169-42b7-bd62-1cf798ee78ed',
  'eaeeafae-62df-4c60-aee8-2beea679dfbe',
  'eb497fa2-fbf6-42bb-a78b-d5a2ca80d9ea',
  'ee21481b-ea0e-4c77-b956-f8448ec8d601',
  'fd918ea8-3783-4a11-8ec2-ec2605eb879d',
  'fd9d683a-86ee-485f-a63e-ee67f53a4794',
  'fdcf480a-9d62-43ce-b371-d60bcf0feef4'
);

COMMIT;
