import unittest
from pathlib import Path

from tools.run_codex_workflow import (
    ROOT,
    available_commands,
    build_prompt,
    command_spec_path,
    normalize_command_name,
)


class RunCodexWorkflowTests(unittest.TestCase):
    def test_normalize_command_name_strips_leading_slash(self):
        self.assertEqual(normalize_command_name('/apply'), 'apply')
        self.assertEqual(normalize_command_name(' setup '), 'setup')

    def test_available_commands_includes_core_wrappers(self):
        commands = available_commands()
        for required in ('setup', 'scrape', 'apply', 'upskill'):
            with self.subTest(required=required):
                self.assertIn(required, commands)

    def test_command_spec_path_resolves_repo_command(self):
        path = command_spec_path('apply')
        self.assertTrue(path.is_file())
        self.assertEqual(path, ROOT / '.claude' / 'commands' / 'apply.md')

    def test_build_prompt_includes_context_and_spec(self):
        spec_text = '# /apply\nTest workflow spec.'
        prompt = build_prompt('apply', ['https://example.com/job/1'], spec_text)
        self.assertIn('You are OpenAI Codex running the `/apply` workflow', prompt)
        self.assertIn('User arguments: https://example.com/job/1', prompt)
        self.assertIn('CLAUDE.md', prompt)
        self.assertIn(spec_text, prompt)

    def test_bin_wrappers_exist(self):
        for wrapper in ('setup', 'scrape', 'apply', 'upskill'):
            with self.subTest(wrapper=wrapper):
                self.assertTrue((ROOT / 'bin' / wrapper).is_file())


if __name__ == '__main__':
    unittest.main()
