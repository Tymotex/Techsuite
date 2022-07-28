import React from 'react';
import ReactPaginate from 'react-paginate';
import './Paginator.scss';

class Paginator extends React.Component {

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
    }

    changePage(page) {
        // Note that pages are indexed from 0 onwards
        const pageIndex = page.selected;
        const { flipPage } =  this.props; 
        flipPage(pageIndex);
    }

    render() {
        const { maxPageNum } = this.props;
        return (
            <div className="paginator">
                <ReactPaginate 
                    pageCount={maxPageNum ? maxPageNum : 10}
                    pageRangeDisplayed={1}
                    onPageChange={this.changePage} />
            </div> 
        )
    }
}

export default Paginator;