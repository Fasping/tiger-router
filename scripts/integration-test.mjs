/**
 * Packs the library exactly as `npm publish` would, installs that tarball into
 * `integration-test/` like a real consumer, then typechecks and runs the suite
 * in there.
 *
 * This is the only check that exercises the `exports` map, the generated
 * `.d.ts` files and the `'use client'` banner through a real resolution path.
 * Unit tests import from `src/`, so they cannot catch a packaging mistake.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const consumer = join(root, 'integration-test')
const packDir = join(consumer, '.pack')

function run(command, args, cwd, options = {}) {
    const label = `${command} ${args.join(' ')}`
    console.log(`\n[36m> ${label}[0m  (in ${cwd.replace(root, '.')})`)

    const result = spawnSync(command, args, {
        cwd,
        stdio: options.capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
        shell: process.platform === 'win32',
        encoding: 'utf8',
    })

    if (result.status !== 0) {
        console.error(`\n[31mFailed: ${label}[0m`)
        process.exit(result.status ?? 1)
    }

    return result.stdout
}

rmSync(packDir, { recursive: true, force: true })
mkdirSync(packDir, { recursive: true })

run('npm', ['run', 'build'], root)
run('npm', ['pack', '--pack-destination', packDir], root)

const tarball = readdirSync(packDir).find(name => name.endsWith('.tgz'))
if (!tarball) {
    console.error('npm pack produced no tarball')
    process.exit(1)
}
console.log(`\nPacked ${tarball}`)

// Dependencies first, then the tarball, so npm cannot prune the unsaved install.
run('npm', ['install', '--no-audit', '--no-fund'], consumer)
run('npm', ['install', join(packDir, tarball), '--no-save', '--no-audit', '--no-fund'], consumer)

run('npm', ['run', 'typecheck'], consumer)
run('npm', ['run', 'test'], consumer)

rmSync(packDir, { recursive: true, force: true })
console.log('\n[32mIntegration test passed: the published package works from outside.[0m')
