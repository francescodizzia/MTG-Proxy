function Card(props) {


    return (
        <div className="card-light mx-auto my-0 p-0" style={{width: '18rem', textAlign: 'center'}}>
                <img src={props.card.image} className="card-img-top" alt="..." />
                <div className="card-body text-center text-white">   
                    <h5>{props.card.name}</h5>         
                    <select value={props.card.selected} onChange={(e) => props.onSelect(e, props.card)} className="form-select form-select-sm" aria-label=".form-select-sm example">
                    {props.card.sets.map((set, index) => (
                        <option value={index} key={index}>{set['set_name']}</option>
                        )
                    )
                    }
                    </select>
                    <button onClick={() => props.onIncrement(props.card)} type="button" className="btn btn-primary m-1"><i className="bi bi-plus"></i> </button>
                    <span className="badge bg-secondary n-1"><h5>{props.card.quantity}</h5></span>
                    <button onClick={() => props.onDecrement(props.card)} type="button" className="btn btn-danger m-1"><i className="bi bi-dash"></i> </button>
            
                </div>
        </div>
    );
}

export default Card;
