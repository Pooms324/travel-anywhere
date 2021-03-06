import { useCallback, useEffect, useState } from "react";
import "./Places.css";
import AddPlaces from "./AddPlaces";
import Place from "./Place.jsx";

const Places = () => {
  const [places,setPlaces]=useState([])
  const placeNamesArr = places.map(place=>place.name)
  const [selectedEl, setSelectedEl] = useState(null);

  const changePlacesCategory=(id,containerName)=>{
    const findItem=places.findIndex(place=>place.id===+id) 
    const item=places[findItem] 
    let updatedPlaces=[...places]
    updatedPlaces[findItem]={...item,disabled:containerName==="visited"?true:false}
    return updatedPlaces
  }


  const onDs1 = (e) => {
    const drags = document.querySelectorAll("drag");

    drags.forEach((drag) => {
      if (placeNamesArr.includes(e.target.id)) {
        drag.className = "drag dragging";
      }
    });
    setSelectedEl(e.target);
  };
  const onDe1 = (e) => {
    const drags = document.querySelectorAll("drag");
    
    drags.forEach((drag) => {
      if (placeNamesArr.includes(e.target.id)) {
        drag.className = "drag";
      }
    });
    setSelectedEl(e.target);
  };


  const insertEl = (container, y) => {

    const elesWithourDrag = [...container.querySelectorAll(".drag:not(.dragging)")];
    return elesWithourDrag.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && closest.offset < offset) {
          return { element: child, offset };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };
  const onDo1 = (e) => {
    e.preventDefault()
    const container1 = [document.querySelector(`.active`)];
    const container2 = [document.querySelector(`.visited`)];
    if (e.target.className.includes("active")) {
      container1.forEach((container) => {
        const adjEl = insertEl(container, e.clientY);
        if (selectedEl) {
          if (adjEl === null) {
            container.appendChild(selectedEl);
          } else {
            container.insertBefore(selectedEl, adjEl);
          }
        }
      });
    } else if (e.target.className.includes("visited")) {
      container2.forEach((container) => {
        const adjEl = insertEl(container,e.clientY);
        if (selectedEl) {     
          if (adjEl === null) {
          container.appendChild(selectedEl);
          } else {
            container.insertBefore(selectedEl, adjEl);
          }
        }
      });
    } else {
      return null;
    }
    setPlaces(changePlacesCategory(selectedEl.id,e.target.className))
  };
  
  const addPlacesHandler=useCallback((placeObj)=>{
    setPlaces(prev=>[...prev,placeObj])
  },[])

  const cont1 = places.map((place) =>{
    if(place.category==='active'){     
      return <Place isdisabled={place.disabled} key={place.id} onStart={onDs1} onEnd={onDe1} name={place.name} id={place.id} thingsToDo={place.thingsToDo} />
    } 
  });
  const cont2 = places.map((place) => {
    if(place.category==='visited'){
      return<Place isdisabled={place.disabled} key={place.id} onStart={onDs1} onEnd={onDe1} name={place.name} id={place.id} thingsToDo={place.thingsToDo} />
    }

});
       
  return (
      <div className="places_section">
        <h2 className="places_heading">Add Your places and Todos</h2>
        <h3 className="places_heading">Drag and drop places</h3>
          <AddPlaces onAdd={addPlacesHandler} />
          <div className="container_sections">
            <div
              onDragOver={(e) => onDo1(e)}
              className="active"
              >
                <h3 className="section_heading">Not Visited</h3>
              {cont1}
            </div>
            <div
              onDragOver={(e) => onDo1(e)}    
              className="visited"
              >
                <h3 className="section_heading">Visited</h3>
              {cont2}
            </div>
          </div>
          <p>app still under development</p>
        </div>
  );
};
export default Places;