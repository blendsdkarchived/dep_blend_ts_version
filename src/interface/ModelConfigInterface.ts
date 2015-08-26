/// <reference path="DictionaryInterface" />
/// <reference path="ModelFieldConfigInterface" />

/**
 * Interface for defining a Model configuration
 */
interface ModelConfigInterface extends DictionaryInterface {
    id: string
    fields: Array<string|ModelFieldConfigInterface>
}