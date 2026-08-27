import { runMathTests } from './math.test';
import { runPhysicsTests } from './physics.test';
import { runECSTests } from './ecs.test';
import { runAITests } from './ai.test';
import { runInventoryTests } from './inventory.test';
import { runSaveStateTests } from './saveState.test';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

export class TestRunner {
  private static results: TestResult[] = [];

  public static assert(condition: boolean, name: string, suite: string): void {
    if (condition) {
      TestRunner.results.push({ suite, name, passed: true });
    } else {
      TestRunner.results.push({ suite, name, passed: false, error: 'Assertion failed' });
    }
  }

  public static assertEqual<T>(actual: T, expected: T, name: string, suite: string): void {
    if (actual === expected) {
      TestRunner.results.push({ suite, name, passed: true });
    } else {
      TestRunner.results.push({
        suite,
        name,
        passed: false,
        error: `Expected ${expected}, got ${actual}`
      });
    }
  }

  public static runAll(): void {
    console.log('🚀 Running Aetheria Automated Test Suite...');
    runMathTests();
    runPhysicsTests();
    runECSTests();
    runAITests();
    runInventoryTests();
    runSaveStateTests();
    TestRunner.report();
  }

  public static report(): void {
    console.log('\n========================================');
    console.log('🧪 AETHERIA AUTOMATED TEST SUITE REPORT');
    console.log('========================================');

    let passedCount = 0;
    let failedCount = 0;

    TestRunner.results.forEach(res => {
      if (res.passed) {
        passedCount++;
        console.log(`  ✅ [PASS] [${res.suite}] ${res.name}`);
      } else {
        failedCount++;
        console.log(`  ❌ [FAIL] [${res.suite}] ${res.name} -> ${res.error}`);
      }
    });

    console.log('----------------------------------------');
    console.log(`Total: ${TestRunner.results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
    console.log('========================================\n');

    if (failedCount > 0) {
      process.exit(1);
    }
  }
}

TestRunner.runAll();
