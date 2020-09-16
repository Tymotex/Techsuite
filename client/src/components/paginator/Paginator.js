import React from 'react';
import ReactPaginate from 'react-paginate';
import './Paginator.scss';

class Paginator extends React.Component {

    render() {
        return (
            <div class="paginator">
                <ReactPaginate 
                    pageCount={10}
                    pageRangeDisplayed={1} />
            </div> 
        )
    }
}

export default Paginator;