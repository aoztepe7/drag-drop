import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import Modal from 'react-modal';
import DropArea from './DropArea';

function DragDropComponentV2() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [asset, setAsset] = useState({});
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [droppedElements, setDroppedElements] = useState([]);
    const [eventObject, setEventObject] = useState(null);
    const [elements, setElements] = useState([]);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    useEffect(() => {
        var sixColumn = {
            "parentElement": "row",
            "code": "SixColumn",
            "class": "col-6 w-b-100",
            "id": "base-col-6",
            "type": "div",
            "displayName": "6 Column",
            "fields": {
                "id": null,
                "class": null
            }
        }
        var row = {
            "parentElement": "none",
            "code": "Row",
            "id": "base-row",
            "class": "row w-b-100",
            "type": "div",
            "displayName": "Row",
            "fields": {
                "id": null,
                "class": null
            }
        }
        var button = {
            "parentElement": "div",
            "code": "Button",
            "id": "base-btn",
            "class": "btn btn-success",
            "type": "button",
            "displayName": "Button",
            "text": "Button",
            "fields": {
                "id": null,
                "class": null
            }
        }

        setElements([sixColumn, button, row]);
    }, []);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }
    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('drag-over');
    };

    const handleSaveAsset = e => {
        e.preventDefault();
        e.stopPropagation();
        var startedEvent = eventObject;
        var obj = selectedObject;
        obj.id = $('.asset-container').find("#id").val();
        var customClass = $('.asset-container').find("#class").val();
        if (startedEvent.target.tagName.toLowerCase() == selectedObject.parentElement) {
            var element = React.createElement(obj.type,
                {
                    id: obj.id,
                    draggable: true,
                    key: obj.code,
                    className: obj.class + " " + customClass,
                    onDragStart: (e) => handleItemDragStart(e),
                    onDragOver: (e) => handleDragOver(e),
                    onDragLeave: (e) => handleDragLeave(e),
                    onDrop: (e) => handleDrop(e),
                    displayName: obj.displayName
                });
            setDroppedElements(currentArray => [...currentArray, element]);
            setIsOpen(false);
        } else {
            alert("Please place following required container first :" + selectedObject.parentElement);
            return;
        }

    }

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();

        e.target.classList.add('drag-over');
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var obj = elements.find(x => x.code == selectedElement);
        setEventObject(e);
        startAssetManager(obj);
    };

    function startAssetManager(obj) {
        setAsset(obj.fields);
        setSelectedObject(obj);
        setIsOpen(true);
    }

    const handleItemDragStart = e => {
        setSelectedElement(e.target.id);
        setEventObject(e);
    };

    return (
        <div className="container-fluid fh-100" style={{ height: "100%" }}>
            <h1>JavaScript - Drag and Drop</h1>
            <Modal
                id='mdl-asset'
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={customStyles}
            >
                <div className='asset-container'>
                    {
                        Object.keys(asset).map(function (key) {
                            return (
                                <div className='form-group' key={key}>
                                    <input type="text" id={key} className='form-control' placeholder={key}></input>
                                </div>)

                        })
                    }
                </div>

                <div className='form-group'>
                    <button type='button' className='btn btn-success' onClick={e => handleSaveAsset(e)}> Save </button>
                    <button type="button" className='btn btn-warning float-right' onClick={closeModal}>Close</button>
                </div>

            </Modal>
            <div className='row drop-targets'>
                <div
                    onDrop={e => handleDrop(e)}
                    onDragOver={e => handleDragOver(e)}
                    onDragLeave={e => handleDragLeave(e)}

                    className='col-3 box box-1' id='element-container' style={{ border: "2px", borderStyle: "solid" }}>
                    {elements.map(function (item) {
                        return React.createElement("div",
                            {
                                id: item["code"],
                                draggable: true,
                                key: item["code"],
                                onDragStart: (e) => handleItemDragStart(e)
                            },
                            item["displayName"])
                    })
                    }
                </div>
                <DropArea
                    elements={droppedElements}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                    handleDragEnter={handleDragEnter}
                    handleDragLeave={handleDragLeave}
                    handleItemDragStart={handleItemDragStart} />
            </div>
        </div>
    )
}

export default DragDropComponentV2;