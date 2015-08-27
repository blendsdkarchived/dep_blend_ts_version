/**
 * Interface for defining fields of a Model
 */
interface ModelFieldConfigInterface {
    name: string
    bindTo?: Array<string>
    getValue?: () => any
    formatValue?: (value: any) => any
}