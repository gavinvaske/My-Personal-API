import "@app/util" // Setup .env
import "@app/server" // To make sure the server file runs which sets up DI
import "../index"

import { ADMIN_TOKEN } from "@app/middleware/auth"
import { isTesting } from "@app/util"
import { FakeDataGenerator } from "./fake_data_generators/types"
import { createDependencies } from "./fake_data_generators/util"
import { initDatabase, closeDatabase } from "@app/model"
import { container } from "@app/di"
import { startServer } from "@app/server"
import { Server } from "http"
import request, { Test, SuperTest } from "supertest"

var server: Server

beforeEach(async () => {
  if (!isTesting) {
    throw new Error("You can only run tests in testing environments.")
  }

  container.snapshot()

  await initDatabase()
})
afterEach(async () => {
  if (server) server.close()

  await closeDatabase()

  container.restore()
})

interface AuthHeader {
  Authorization: string
}

interface ApiVersionHeader {
  "accept-version": string
}

export const authHeader = (accessToken: string): AuthHeader => {
  return { Authorization: `Bearer ${accessToken}` }
}

export const adminAuthHeader = (): AuthHeader => {
  return { Authorization: `Bearer ${ADMIN_TOKEN}` }
}

export const endpointVersionHeader = (version: string): ApiVersionHeader => {
  return { "accept-version": version }
}

export const serverRequest = (): SuperTest<Test> => {
  return request(server)
}

export const setup = async (
  fakeData?: FakeDataGenerator[],
  overrideDependencies?: () => void
): Promise<void> => {
  if (fakeData) await createDependencies(fakeData)
  if (overrideDependencies) overrideDependencies()

  server = startServer()
}
