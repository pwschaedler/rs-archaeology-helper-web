import * as arch from './arch'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

/**
 * Setup sample collection in knowledge base.
 */
function setupSaradoministIII(): void {
    const kb = arch.KnowledgeBase

    kb.addMaterial('White marble')
    kb.addMaterial('Leather scraps')
    kb.addMaterial('Keramos')
    kb.addMaterial('Goldrune')
    kb.addMaterial('Star of Saradomin')
    kb.addMaterial('Clockwork')
    kb.addMaterial('Third Age iron')
    kb.addMaterial('Everlight silvthril')

    kb.addArtefact('Dominarian device', [
        ['Everlight silvthril', 30],
        ['Keramos', 22],
        ['Third Age iron', 22],
        ['Clockwork', 1],
    ])
    kb.addArtefact('Fishing trident', [
        ['Star of Saradomin', 22],
        ['Third Age iron', 30],
        ['Goldrune', 22],
    ])
    kb.addArtefact('Amphora', [
        ['Everlight silvthril', 34],
        ['Keramos', 46],
    ])
    kb.addArtefact('Rod of Asclepius', [
        ['White marble', 30],
        ['Star of Saradomin', 24],
        ['Goldrune', 26],
    ])
    kb.addArtefact('Kopis dagger', [
        ['Everlight silvthril', 50],
        ['Leather scraps', 42],
    ])
    kb.addArtefact('Xiphos short sword', [
        ['Everlight silvthril', 46],
        ['Leather scraps', 46],
    ])

    kb.addCollection('Saradominist III', [
        'Dominarian device',
        'Fishing trident',
        'Amphora',
        'Rod of Asclepius',
        'Kopis dagger',
        'Xiphos short sword',
    ])
}

afterEach(() => {
    arch.KnowledgeBase.clear()
})

describe('knowledge base', () => {
    test('get material non-existent', () => {
        const kb = arch.KnowledgeBase
        expect(kb.getMaterial('asdf')).toBeUndefined()
    })

    test('get artefact non-existent', () => {
        const kb = arch.KnowledgeBase
        expect(kb.getArtefact('asdf')).toBeUndefined()
    })

    test('get collection non-existent', () => {
        const kb = arch.KnowledgeBase
        expect(kb.getCollection('asdf')).toBeUndefined()
    })

    test('add material', () => {
        const kb = arch.KnowledgeBase
        kb.addMaterial('Everlight silvthril')
        const material = kb.getMaterial('Everlight silvthril')
        expect(material).toBeDefined()
        expect(material!.name).toEqual('Everlight silvthril')
    })

    test('add material duplicates', () => {
        const kb = arch.KnowledgeBase
        kb.addMaterial('Everlight silvthril')
        kb.addMaterial('Everlight silvthril')
        expect(Object.entries(kb.materials).length).toEqual(1)
    })

    test('add artefact', () => {
        const kb = arch.KnowledgeBase
        kb.addArtefact('Dominarian device', [
            ['Everlight silvthril', 30],
            ['Keramos', 22],
            ['Third Age iron', 22],
            ['Clockwork', 1],
        ])
        const artefact = kb.getArtefact('Dominarian device')
        expect(artefact).toBeDefined()
        expect(artefact!.name).toEqual('Dominarian device')
        expect(artefact!.requiredMaterials).toEqual([
            ['Clockwork', 1],
            ['Everlight silvthril', 30],
            ['Keramos', 22],
            ['Third Age iron', 22],
        ])
    })

    test('add collection', () => {
        const kb = arch.KnowledgeBase
        kb.addCollection('Saradominist III', [
            'Dominarian device',
            'Fishing trident',
            'Amphora',
            'Rod of Asclepius',
            'Kopis dagger',
            'Xiphos short sword',
        ])
        const collection = kb.getCollection('Saradominist III')
        expect(collection).toBeDefined()
        expect(collection!.name).toEqual('Saradominist III')
        expect(collection!.artefacts).toEqual([
            'Amphora',
            'Dominarian device',
            'Fishing trident',
            'Kopis dagger',
            'Rod of Asclepius',
            'Xiphos short sword',
        ])
    })

    test('global', () => {
        const kb1 = arch.KnowledgeBase
        const kb2 = arch.KnowledgeBase
        kb1.addMaterial('Everlight silvthril')
        const material = kb2.getMaterial('Everlight silvthril')
        expect(material).toBeDefined()
        kb1.clear()
        expect(kb2.getMaterial('Everlight silvthril')).toBeUndefined()
    })
})

describe('goal', () => {
    beforeEach(setupSaradoministIII)

    test('get goal materials w/o material storage', () => {
        const goal = new arch.Goal()
        goal.addCollection('Saradominist III')
        const materialsNeeded = goal.getMaterialsNeeded()
        expect(materialsNeeded).toEqual([
            ['Clockwork', 1],
            ['White marble', 30],
            ['Star of Saradomin', 46],
            ['Goldrune', 48],
            ['Third Age iron', 52],
            ['Keramos', 68],
            ['Leather scraps', 88],
            ['Everlight silvthril', 160],
        ])
    })

    test('get goal materials w/ material storage', () => {
        const goal = new arch.Goal()
        goal.addCollection('Saradominist III')

        const materials = new arch.MaterialStorage() // Put some materials in here

        const materialsNeeded = goal.getMaterialsNeeded(materials)
        expect(materialsNeeded).toEqual([
            ['Clockwork', 1],
            ['White marble', 30],
            ['Star of Saradomin', 46],
            ['Third Age iron', 52],
            ['Everlight silvthril', 60],
            ['Keramos', 68],
            ['Leather scraps', 88],
        ])
    })
})
