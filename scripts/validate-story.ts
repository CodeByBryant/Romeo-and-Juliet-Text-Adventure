import { ENDINGS, START_SCENE_ID, STORY_NODE_MAP, STORY_NODES } from '../src/data/story'
import { clampStat, evaluateLuck, resolveEnding, rollD10 } from '../src/lib/engine'
import { ENDING_GATE_ID, type InventoryItem, type SceneId } from '../src/types/game'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function validateNodeCount() {
  assert(
    STORY_NODES.length >= 75 && STORY_NODES.length <= 100,
    `Story node count must be between 75 and 100. Found ${STORY_NODES.length}.`,
  )
}

function validateActs() {
  const countByAct = new Map<number, number>()

  for (const node of STORY_NODES) {
    countByAct.set(node.act, (countByAct.get(node.act) ?? 0) + 1)
  }

  for (const act of [1, 2, 3, 4, 5]) {
    const count = countByAct.get(act) ?? 0
    assert(count > 0, `Act ${act} has no scenes.`)
  }
}

function validateIdsAndEdges() {
  const seen = new Set<string>()

  for (const node of STORY_NODES) {
    assert(!seen.has(node.id), `Duplicate scene id detected: ${node.id}`)
    seen.add(node.id)

    for (const choice of node.choices) {
      if (choice.nextId === ENDING_GATE_ID) {
        continue
      }

      assert(
        STORY_NODE_MAP.has(choice.nextId),
        `Choice ${choice.id} from ${node.id} points to missing node ${choice.nextId}.`,
      )
    }
  }
}

function validateReachability() {
  const visited = new Set<SceneId>()
  const stack: SceneId[] = [START_SCENE_ID]

  while (stack.length > 0) {
    const current = stack.pop() as SceneId
    if (visited.has(current)) {
      continue
    }

    visited.add(current)
    const node = STORY_NODE_MAP.get(current)
    assert(Boolean(node), `Missing node while traversing: ${current}`)

    for (const choice of node!.choices) {
      if (choice.nextId === ENDING_GATE_ID) {
        continue
      }

      if (!visited.has(choice.nextId)) {
        stack.push(choice.nextId)
      }
    }
  }

  assert(
    visited.size === STORY_NODES.length,
    `Reachability mismatch: visited ${visited.size} of ${STORY_NODES.length} nodes.`,
  )
}

function validateEndingBands() {
  for (const ending of ENDINGS) {
    const sampleFate = Math.floor((ending.fateRange[0] + ending.fateRange[1]) / 2)
    const sampleLuck = Math.floor((ending.luckRange[0] + ending.luckRange[1]) / 2)

    const resolved = resolveEnding(ENDINGS, sampleFate, sampleLuck)
    assert(
      resolved.id === ending.id,
      `Ending band mismatch for ${ending.id}. Resolved ${resolved.id} using midpoint sample.`,
    )
  }
}

function simulatePlaythrough(maxSteps = 120) {
  let currentSceneId: SceneId = START_SCENE_ID
  let fate = 0
  let luck = 0
  let inventory: InventoryItem[] = []

  for (let step = 0; step < maxSteps; step += 1) {
    const node = STORY_NODE_MAP.get(currentSceneId)
    assert(Boolean(node), `Simulation failed to load node: ${currentSceneId}`)

    const available = node!.choices.filter((choice) => {
      if (!choice.requireItems || choice.requireItems.length === 0) {
        return true
      }

      return choice.requireItems.every((required) => inventory.includes(required))
    })

    assert(available.length > 0, `No available choices at ${currentSceneId}`)

    const choice = available[Math.floor(Math.random() * available.length)]
    const roll = rollD10()
    const { luckShift } = evaluateLuck(roll, choice.luckBias)
    const criticalFateSwing = luckShift === 2 ? 1 : luckShift === -2 ? -1 : 0

    fate = clampStat(fate + choice.fateShift + criticalFateSwing)
    luck = clampStat(luck + luckShift)
    inventory = Array.from(new Set([...inventory, ...(choice.addItems ?? [])]))

    if (choice.nextId === ENDING_GATE_ID) {
      return resolveEnding(ENDINGS, fate, luck).id
    }

    currentSceneId = choice.nextId
  }

  throw new Error('Simulation exceeded max steps without reaching an ending.')
}

function runMonteCarlo(simulations = 5000) {
  const counts = new Map<string, number>()

  for (let i = 0; i < simulations; i += 1) {
    const endingId = simulatePlaythrough()
    counts.set(endingId, (counts.get(endingId) ?? 0) + 1)
  }

  return counts
}

function main() {
  validateNodeCount()
  validateActs()
  validateIdsAndEdges()
  validateReachability()
  validateEndingBands()

  const simulationCounts = runMonteCarlo()

  console.log(`Validated ${STORY_NODES.length} story nodes successfully.`)
  console.log('Monte Carlo ending distribution (5000 runs):')

  for (const ending of ENDINGS) {
    console.log(`- ${ending.id} ${ending.title}: ${simulationCounts.get(ending.id) ?? 0}`)
  }
}

main()
