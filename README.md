Prisma:
to init: npx prisma migrate dev --name init

when added new field or new table or smothing change: npx prisma migrate dev --name add_new_table

when deploy: npx prisma migrate deploy

when generate: npx prisma generate

envs for NEXT_AUTH
AUTH_SECRET
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXTAUTH_SECRET_EXPIRES_IN
