import {defineConfig} from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        user: 'avnadmin',
        password: 'AVNS_NV0uRHW6UnKC_k_NdLD',
        host: "marraph-1-speed.j.aivencloud.com",
        port: 22482,
        database: 'calla2',
        ssl: {
            rejectUnauthorized: true,
            ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUIGA9NCFgxjBpgTBrxlBlgS42864wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZWYzMmQ3NjktNTc5Mi00OTcxLWEzNzAtNTEyZWFhZGE0
YmMwIFByb2plY3QgQ0EwHhcNMjQwNDIzMTAzMjUzWhcNMzQwNDIxMTAzMjUzWjA6
MTgwNgYDVQQDDC9lZjMyZDc2OS01NzkyLTQ5NzEtYTM3MC01MTJlYWFkYTRiYzAg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMMKEVhm
r49gIYT7wPSO9yu28k+lMSfmyUhYs7mzIvBEIMEQTxJ3Ap3A469scOmoaEGlWMNt
Ew2UbICh9bELJE+2XIDlmwthn9Q6PPXhQndGlIU2DiEOQbLJK7gUUJXD2WKeUIq9
F8lXBX0DbcUyI0iynxCMMdZkJ64AcJ5r8bviPZjv3WYSKl6ViyHoHq85OURBbmEG
SQ/McA9lakVBkj1KYNljjFCKXdi2oH9nF2Gxsuimb8tQdclBIkQBPwjEXWZTCaf1
j0EwopFKgyw2iGN+hbhJljFY5T5X8ObJAXBdAU/6oiK/oaws5ldxxiH3BP24SX8x
f6Keea2GHXQmFYFMDeEmtWM1asmOh2rN0v/d4Y9mSzB4Ub+soJTLrllMf/5FKiOi
/CKWzbsTL3M9cdX7mzvm8FTOANvIqz+RRqguR3dDlQ3N8OReJ3vakdihFS4Y9pze
MjKwjvSber0uWvouIO4mgSz99Udat6j+Iv7lboQafJwENFM1QeaBpL61vwIDAQAB
oz8wPTAdBgNVHQ4EFgQUL9sUTZMs840PMo4D0Ntxvi+eOfowDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBABVyw30kI9zovNqW
ZxOOL4vQxvzwHRsZGmt401XyLUbi/1YMO4yfIQRtvzlJgKWR087Q/XWf4jeIqgLU
L4eRUK2fomt0ZGpJYaCcP9nIQCSRbXNSV74DpqJHdg4dyUEZAOwM7B2LvPC06ugK
7y6qoQR/3nNLI+INymxlHmOZCJCy1F6c84MLjEd6teI2sL5F9olTc/ccqinpsBIu
5eCzOVvfDe3Fc6WMNb0S8ebKZBZ38ujuX+zBHfekgiAFjtP6TTtvwdfahjl3/Aq7
PRANtNBDuB74wN5oIuJQ6OGYnJPBR0Ityy6I8tZLv3ptfVE31WzSUhw4R7VGFw7g
woxtyy1Z6X3wgb3GdYR6pLut1SV8kuC+3JA8hVXwz0dgGcpVRyjJmRY0p7yg0VLB
Ak19ryvzY8nqTj2wE6AsmD4Ka5I0jdHLkpgktFf/joe59kd7Mdik7mZ12uDXJCle
6WC94xtc0e8W1piAUAO+NYxEwWFB+GcGSrKQ/bSF9l3VYhZp6A==
-----END CERTIFICATE-----`
        }
    }
});