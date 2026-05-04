import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '#start/env'
import { cuid } from '@adonisjs/core/helpers'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile } from 'node:fs/promises'

const ALLOWED_EXTNAMES = [
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'doc',
  'docx',
]
const MAX_SIZE = '20mb'
const URL_EXPIRES_SECONDS = 60 * 60 * 24 * 7 // 7 días

let _client: S3Client | null = null
function getClient(): S3Client {
  if (_client) return _client
  const endpoint = env.get('STORAGE_ENDPOINT')
  const region = env.get('STORAGE_REGION') || 'auto'
  const accessKeyId = env.get('STORAGE_ACCESS_KEY')
  const secretAccessKey = env.get('STORAGE_SECRET_KEY')

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Storage no configurado: revisa STORAGE_* en .env')
  }

  _client = new S3Client({
    region,
    endpoint,
    forcePathStyle: true, // Tigris/T3 usa path-style
    credentials: { accessKeyId, secretAccessKey },
  })
  return _client
}

export interface UploadFileResult {
  key: string
  url: string // presigned URL, válida 7 días
  filename: string
  size: number
  contentType: string
}

/**
 * Sube un archivo multipart al bucket configurado y devuelve una presigned URL
 * válida por 7 días para visualizar/descargar el archivo. La key permanente
 * se guarda en BD para regenerar URLs si se necesita después.
 */
export async function uploadFile(
  file: MultipartFile,
  folder: string = 'uploads'
): Promise<UploadFileResult> {
  const bucket = env.get('STORAGE_BUCKET')!
  if (!bucket) throw new Error('STORAGE_BUCKET no configurado')

  if (!file.isValid) {
    throw new Error(`Archivo inválido: ${file.errors.map((e) => e.message).join(', ')}`)
  }

  const ext = (file.extname || 'bin').toLowerCase()
  const safeFolder = folder.replace(/[^a-z0-9-_/]/gi, '').replace(/^\/+|\/+$/g, '')
  const key = `${safeFolder || 'uploads'}/${cuid()}.${ext}`

  if (!file.tmpPath) throw new Error('Archivo sin tmpPath')
  const body = await readFile(file.tmpPath)

  const contentType = file.headers?.['content-type'] || 'application/octet-stream'

  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType as string,
    })
  )

  const url = await generarUrlFirmada(key)

  return {
    key,
    url,
    filename: file.clientName || key,
    size: file.size,
    contentType: contentType as string,
  }
}

/**
 * Genera una presigned URL para descargar un objeto. Válida 7 días por default.
 */
export async function generarUrlFirmada(
  key: string,
  expiresSeconds: number = URL_EXPIRES_SECONDS
): Promise<string> {
  const bucket = env.get('STORAGE_BUCKET')!
  return await getSignedUrl(
    getClient(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresSeconds }
  )
}

export const STORAGE_LIMITS = {
  size: MAX_SIZE,
  extnames: ALLOWED_EXTNAMES,
}
