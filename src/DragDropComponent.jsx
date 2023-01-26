import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import Modal from 'react-modal';

function Welcome() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [asset, setAsset] = useState({});
    const [selectedElement, setSelectedElement] = useState(null);
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
        var elProps = {};
        var eObj = eventObject;
        eObj.relatedTarget = "asset-done";
        eObj.currentTarget = $("#main-item-container");
        elProps.id = $('.asset-container').find("#id").val();
        elProps.class = $('.asset-container').find("#class").val();
        var idd = eObj.dataTransfer.getData('text/plain');
        handleDrop(eObj, elProps);
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
    const handleDrop = (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        var selectedEl = selectedElement;
        if (e.currentTarget.id == "element-container") {
            $('#main-item-container').find("#" + selectedEl).remove();
        } else {
            var obj = elements.find(x => x.code == selectedEl);
            var objParentRequirement = obj.parentElement;
            var elId = obj.code;
            var elClass = obj.class;

            if (p != null) {
                elId = p.id;
                elClass += " " + p.class;
            }

            var element = $("<" + obj.type + ">", {
                id: elId,
                class: elClass,
                draggable: true,
            });
            element.on('drop', function (e) { handleDrop(e) });
            element.on('dragOver', function (e) { handleDragOver(e) });
            element.on('dragLeave', function (e) { handleDragLeave(e) });
            element.on('dragStart', function (e) { handleItemDragStart(e) });

            // if (e.relatedTarget != "asset-done") {
            //     setEventObject(e);
            // }

            if (e.relatedTarget != "asset-done") {
                if (objParentRequirement != $(e.currentTarget).parent()[0].localName && objParentRequirement != "none") {
                    alert("Plase place container element first : " + objParentRequirement);
                    return;
                } else {
                    if (Object.keys(asset).length == 0) {
                        setSelectedElement(elId);
                        setAsset(obj.fields);
                        setIsOpen(true);
                    }
                }
            } else {
                $(e.currentTarget).append(element);
                setIsOpen(false);
                setAsset({});
                setSelectedElement('');
            }
        }
    };

    const handleItemDragStart = e => {
        setSelectedElement(e.target.id);
        //e.dataTransfer.setData('text/plain', e.target.id);
        setEventObject(e);
    };

    return (
        <div className="container-fluid fh-100" style={{ height: "100%" }}>
            <h1>JavaScript - Drag and Drop</h1>
            <Modal
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
                        return <div draggable="true" id={item.code} data-ui-id={item.type}
                            key={item.code}
                            onDragStart={e => handleItemDragStart(e)}
                        >{item.displayName}</div>
                    })
                    }
                </div>
                <div
                    id="main-item-container"
                    onDrop={e => handleDrop(e)}
                    onDragOver={e => handleDragOver(e)}
                    onDragLeave={e => handleDragLeave(e)}
                    onDragStart={e => handleItemDragStart(e)}
                    className='col-9 box box-2' style={{ border: "2px", borderStyle: "solid" }}>

                </div>
            </div>
        </div>
    )
}

export default Welcome;