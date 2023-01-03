export type ItemQuantity<T> = readonly [T, number]

/**
 * A single material used to restore artefacts.
 */
export class Material {
    constructor(readonly name: string) {}
}

/**
 * An artefact and the materials needed to restore it.
 * Materials are stored sorted by name.
 */
export class Artefact {
    constructor(
        readonly name: string,
        readonly requiredMaterials: ItemQuantity<string>[]
    ) {}
}

/**
 * A collection of artefacts.
 * Artefacts are stored sorted by name.
 */
export class Collection {
    constructor(readonly name: string, readonly artefacts: string[]) {}
}

/**
 * Knowledge base to store and query information about collections and
 * artefacts. Acts as a global database.
 */
export class KnowledgeBase {
    static materials: Record<string, Material> = {}
    static artefacts: Record<string, Artefact> = {}
    static collections: Record<string, Collection> = {}

    /**
     * Add a material to the knowledge base.
     */
    static addMaterial(materialName: string): void {
        this.materials[materialName] = new Material(materialName)
    }

    /**
     * Add an artefact to the knowledge base.
     */
    static addArtefact(
        artefactName: string,
        requiredMaterials: ItemQuantity<string>[]
    ): void {
        this.artefacts[artefactName] = new Artefact(
            artefactName,
            requiredMaterials.sort(([aName], [bName]) =>
                aName.localeCompare(bName)
            )
        )
    }

    /**
     * Add a collection to the knowledge base.
     */
    static addCollection(collectionName: string, artefacts: string[]): void {
        this.collections[collectionName] = new Collection(
            collectionName,
            artefacts.sort()
        )
    }

    /**
     * Get a material by name.
     */
    static getMaterial(materialName: string): Material | undefined {
        return this.materials[materialName]
    }

    /**
     * Get an artefact by name.
     */
    static getArtefact(artefactName: string): Artefact | undefined {
        return this.artefacts[artefactName]
    }

    /**
     * Get a collection by name.
     */
    static getCollection(collectionName: string): Collection | undefined {
        return this.collections[collectionName]
    }

    /**
     * Clear the knowledge base.
     */
    static clear(): void {
        this.materials = {}
        this.artefacts = {}
        this.collections = {}
    }
}

/**
 * Represents a player's material storage.
 */
export class MaterialStorage {}

/**
 * Represents a goal of artefact restorations to achieve.
 */
export class Goal {
    artefacts: Record<string, number> = {}

    /**
     * Add an artefact to the goal.
     */
    addArtefact(artefactName: string): void {
        if (!(artefactName in this.artefacts)) {
            this.artefacts[artefactName] = 0
        }
        this.artefacts[artefactName]++
    }

    /**
     * Add all artefacts in a collection to the goal.
     */
    addCollection(collectionName: string): void {
        const collection = KnowledgeBase.getCollection(collectionName)
        if (collection === undefined) {
            throw `Collection ${collectionName} does not exist.`
        }
        for (const artefactName of collection.artefacts) {
            this.addArtefact(artefactName)
        }
    }

    /**
     * Get all materials needed to achieve the goal, sorted by quantity.
     */
    getMaterialsNeeded(
        materialStorage?: MaterialStorage
    ): ItemQuantity<string>[] {
        const materialsNeeded: Record<string, number> = {}
        for (const [artName, artQuantity] of Object.entries(this.artefacts)) {
            const artefact = KnowledgeBase.getArtefact(artName)
            if (artefact === undefined) {
                throw `Artefact ${artName} does not exist.`
            }
            for (const [matName, matQuantity] of artefact.requiredMaterials) {
                if (!(matName in materialsNeeded)) {
                    materialsNeeded[matName] = 0
                }
                materialsNeeded[matName] += matQuantity * artQuantity
            }
        }

        // TODO Account for material storage

        const positiveMaterialsNeeded = Object.fromEntries(
            Object.entries(materialsNeeded).filter(
                ([, quantity]) => quantity > 0
            )
        )

        const sorted = Object.entries(positiveMaterialsNeeded).sort(
            ([itemA, quantityA], [itemB, quantityB]) =>
                quantityA - quantityB || itemA.localeCompare(itemB)
        )
        return sorted
    }
}
