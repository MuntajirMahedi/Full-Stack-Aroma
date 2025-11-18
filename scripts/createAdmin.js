#!/usr/bin/env node
/**
 * One-time admin creator/promoter script.
 * Usage:
 *   node scripts/createAdmin.js --email admin@example.com --password secret --name Admin
 * Or set env vars ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME and run:
 *   node scripts/createAdmin.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const User = require(path.join(__dirname, '..', 'models', 'User'))

function parseArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx === -1) return null
  return process.argv[idx + 1]
}

const email = parseArg('--email') || process.env.ADMIN_EMAIL || 'admin@example.com'
const password = parseArg('--password') || process.env.ADMIN_PASSWORD || 'adminpass'
const name = parseArg('--name') || process.env.ADMIN_NAME || 'Admin'

async function main() {
  const mongo = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/aroma'
  if (!mongo) {
    console.error('MONGODB_URI not set. Set it in .env or pass environment variable.')
    process.exit(1)
  }

  await mongoose.connect(mongo, { connectTimeoutMS: 10000 })
  console.log('Connected to MongoDB')

  try {
    let user = await User.findOne({ email })
    const hashed = await bcrypt.hash(password, 10)

    if (user) {
      user.name = name
      user.password = hashed
      user.role = 'admin'
      await user.save()
      console.log(`Updated existing user ${email} -> admin`)
    } else {
      user = await User.create({ name, email, password: hashed, role: 'admin' })
      console.log(`Created admin user ${email}`)
    }
  } catch (err) {
    console.error('Error creating admin:', err.message)
    process.exit(1)
  } finally {
    mongoose.connection.close()
  }
}

main()
