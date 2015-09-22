/// <reference path="DictionaryInterface" />

/**
 * Interface for defining fields of a Model
 */
interface ModelFieldConfigInterface extends DictionaryInterface {
    name: string
    bindTo?: Array<string>
    getValue?: () => any
    formatValue?: (value: any) => any
}