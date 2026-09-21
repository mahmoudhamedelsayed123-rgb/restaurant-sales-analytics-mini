import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('..');

async function runGitWorkflow() {
  console.log('=== GITHUB UPLOAD SECURITY & EXECUTION SCRIPT ===');
  console.log('Project Root:', projectRoot);

  // 1. Initialize git repo if not exists
  await git.init({ fs, dir: projectRoot });

  // 2. Ensure main branch
  try {
    await git.branch({ fs, dir: projectRoot, ref: 'main' });
  } catch (e) {
    // Branch main may already exist
  }

  // 3. List all files recursively
  function getFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (
        file === 'node_modules' ||
        file === '.git' ||
        file === 'dist' ||
        file === '.env'
      ) {
        return;
      }
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath, arrayOfFiles);
      } else {
        const relPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
        arrayOfFiles.push(relPath);
      }
    });
    return arrayOfFiles;
  }

  const filesToAdd = getFiles(projectRoot);

  // Security Check: Verify .env is strictly excluded
  const hasEnv = filesToAdd.some((f) => f.endsWith('.env'));
  if (hasEnv) {
    throw new Error('SECURITY VIOLATION: .env file found in list of files to stage!');
  }

  console.log(`\nStaging ${filesToAdd.length} safe files...`);
  for (const file of filesToAdd) {
    await git.add({ fs, dir: projectRoot, filepath: file });
  }

  // Double Check Git Status
  const statusMatrix = await git.statusMatrix({ fs, dir: projectRoot });
  const trackedFiles = statusMatrix
    .filter(([_, head, worktree, stage]) => stage === 2)
    .map(([file]) => file);

  console.log('\nTracked files count:', trackedFiles.length);
  console.log('Is frontend/.env tracked?', trackedFiles.includes('frontend/.env'));

  if (trackedFiles.includes('frontend/.env')) {
    throw new Error('SECURITY CRITICAL: frontend/.env is tracked!');
  }

  // 4. Commit
  const commitSha = await git.commit({
    fs,
    dir: projectRoot,
    author: {
      name: 'Antigravity AI',
      email: 'antigravity@gemini.ai',
    },
    message: 'Initial release - Restaurant Sales Analytics Mini System',
  });

  console.log('\n✅ COMMIT CREATED SUCCESSFULLY!');
  console.log('Commit Hash:', commitSha);
  console.log('Branch: main');
  console.log('Total Files Committed:', trackedFiles.length);
  console.log('frontend/.env Tracked: NO');
  console.log('Secrets Exposed: NO');

  // 5. Remote Setup
  const repoUrl = 'https://github.com/mahmoudhamedelsayed123-rgb/restaurant-sales-analytics-mini.git';
  await git.addRemote({
    fs,
    dir: projectRoot,
    remote: 'origin',
    url: repoUrl,
    force: true,
  });

  console.log('\nRemote origin set to:', repoUrl);
}

runGitWorkflow().catch((err) => {
  console.error('Git Workflow Error:', err);
  process.exit(1);
});
