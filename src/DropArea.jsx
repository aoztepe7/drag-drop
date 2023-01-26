import React, { useEffect } from 'react';

function DropArea(props) {
    useEffect(() => {
        console.log(props.elements);
    }, [props.elements]);

    return (
        <div
            id="main-item-container" key={"main-item-container"}
            onDrop={e => props.handleDrop(e)}
            onDragOver={e => props.handleDragOver(e)}
            onDragLeave={e => props.handleDragLeave(e)}
            onDragStart={e => props.handleItemDragStart(e)}
            className='col-9 box box-2' style={{ border: "2px", borderStyle: "solid" }}>
            {props.elements != null && props.elements.length != 0 &&

                props.elements.map(function (item) {
                    return React.createElement(item.type,
                        {
                            id: item.props.id,
                            draggable: true,
                            key: item.props.id,
                            className: item.props.className,
                            onDragStart: (e) => props.handleItemDragStart(e),

                        },
                        item.childs)
                })
            }
        </div>
    )
}

export default DropArea;