import React, { useEffect, useState } from 'react';
import {
    Button,
    EditorToolbarButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { v4 as uuid } from 'uuid';

interface FieldProps {
    sdk: FieldExtensionSDK;
}

/** An Item which represents an list item of the repeater app */
interface Item {
    id: string;
    tutorial_step_number: string;
    tutorial_step_description: string;
    tutorial_step_command: string;
}

/** A simple utility function to create a 'blank' item
 * @returns A blank `Item` with a uuid
*/
function createItem(): Item {
    return {
        id: uuid(),
        tutorial_step_number: '',
        tutorial_step_description: '',
        tutorial_step_command: '',
    };
}

/** The Field component is the Repeater App which shows up 
 * in the Contentful field.
 * 
 * The Field expects and uses a `Contentful JSON field`
 */
const Field = (props: FieldProps) => {
    const { valueName = 'Value' } = props.sdk.parameters.instance as any;
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        // This ensures our app has enough space to render
        props.sdk.window.startAutoResizer();

        // Every time we change the value on the field, we update internal state
        props.sdk.field.onValueChanged((value: Item[]) => {
            if (Array.isArray(value)) {
                setItems(value);
            }
        });
    });

    /** Adds another item to the list */
    const addNewItem = () => {
        props.sdk.field.setValue([...items, createItem()]);
    };

    /** Creates an `onChange` handler for an item based on its `property`
     * @returns A function which takes an `onChange` event 
    */
    const createOnChangeHandler = (item: Item, property: 'tutorial_step_number' | 'tutorial_step_description' | 'tutorial_step_command') => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const itemList = items.concat();
        const index = itemList.findIndex((i) => i.id === item.id);

        itemList.splice(index, 1, { ...item, [property]: e.target.value });

        props.sdk.field.setValue(itemList);
    };

    /** Deletes an item from the list */
    const deleteItem = (item: Item) => {
        props.sdk.field.setValue(items.filter((i) => i.id !== item.id));
    };

    return (
        <div>
            <Table>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <TextField
                                    id="tutorial_step_number"
                                    name="tutorial_step_number"
                                    labelText="Step Number"
                                    value={item.tutorial_step_number}
                                    onChange={createOnChangeHandler(item, 'tutorial_step_number')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="tutorial_step_description"
                                    name="tutorial_step_description"
                                    labelText="Step Description"
                                    value={item.tutorial_step_description}
                                    onChange={createOnChangeHandler(item, 'tutorial_step_description')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="tutorial_step_command"
                                    name="tutorial_step_command"
                                    labelText="Step Command"
                                    value={item.tutorial_step_command}
                                    onChange={createOnChangeHandler(item, 'tutorial_step_command')}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <EditorToolbarButton
                                    label="delete"
                                    icon="Delete"
                                    onClick={() => deleteItem(item)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                buttonType="naked"
                onClick={addNewItem}
                icon="PlusCircle"
                style={{ marginTop: tokens.spacingS }}
            >
                Add Item
            </Button>
        </div>
    );
};

export default Field;