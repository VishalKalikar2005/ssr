import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('.git') && !dirFile.includes('node_modules') && !dirFile.includes('dist')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.md') || dirFile.endsWith('.json') || dirFile.endsWith('.js') || dirFile.endsWith('.snap')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('e:/Work/indobase sdk/ssr');

for (const file of files) {
  // don't run on this script
  if (file.endsWith('rebrand.js')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Dependencies and imports
  content = content.replace(/@supabase\/supabase-js/g, 'indobase-js');
  content = content.replace(/@supabase\/ssr/g, '@indobase/ssr');

  // 2. Exact API renames
  content = content.replace(/createServerClient/g, 'createServerIndobaseClient');
  content = content.replace(/createBrowserClient/g, 'createBrowserIndobaseClient');

  // 3. Supabase -> Indobase (Case preserving somewhat)
  content = content.replace(/Supabase/g, 'Indobase');
  content = content.replace(/supabase/g, 'indobase');
  content = content.replace(/SUPABASE/g, 'INDOBASE');

  // 4. Cookie prefixes
  content = content.replace(/sb-/g, 'ib-');

  // 5. Environmental vars (in case they exist)
  content = content.replace(/SUPABASE_URL/g, 'INDOBASE_URL');
  content = content.replace(/SUPABASE_ANON_KEY/g, 'INDOBASE_ANON_KEY');
  content = content.replace(/SUPABASE_SERVICE_ROLE/g, 'INDOBASE_SERVICE_ROLE');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
