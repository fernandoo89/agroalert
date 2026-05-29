#!/usr/bin/env node
/*
  Script para crear un usuario admin en Supabase.

  Uso (desde la raíz del proyecto):
    SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/create_admin.js email@example.com P@ssword123 "Nombre Completo"

  Nota de seguridad: este script usa la Service Role Key de Supabase que tiene privilegios poderosos.
  Ejecuta esto solo en tu máquina local o en un entorno seguro; nunca publiques la Service Role Key.
*/

import { createClient } from '@supabase/supabase-js';

const [,, email, password, nombre] = process.argv;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  process.exit(1);
}

if (!email || !password || !nombre) {
  console.error('Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create_admin.js email password "Nombre Completo"');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function main() {
  try {
    console.log('Creando usuario auth en Supabase...');
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre }
    });

    if (createError) throw createError;
    const user = data.user || data;
    if (!user || !user.id) throw new Error('No se obtuvo user.id desde Supabase');

    console.log('Usuario creado en auth con id:', user.id);

    // Insertar o actualizar perfil en la tabla `profiles`
    console.log('Insertando fila en tabla profiles...');
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      nombre,
      email,
      es_admin: true
    }, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    console.log('Perfil creado/actualizado correctamente. Usuario es admin (es_admin = true).');
    console.log('Puedes iniciar sesión con este correo y la contraseña indicada.');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
