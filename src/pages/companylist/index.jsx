import { observer } from "mobx-react";
import axios from "axios";
import { useMutation } from "react-query";
import styles from '../../styles/companylist/companylist.module.css';
import Table from "../../components/common/Table";
import SearchBar from "../../components/common/SearchBar";
import Loading from "../../components/designTool/Loading";
import CustomDropdown from '../../components/designTool/CustomDropdown';
import SortComponent from "../../components/companylist/SortComponent";

const CompanyComponent = observer(()=> { 
    const columns = useMemo(() =>[{ Header: 'No', accessor: 'index' },
        { Header: '공고명', accessor: 'title' },
        { Header: '회사명', accessor: 'company' },
        { Header:'조건', accessor:'require'},
        { Header: '마감일', accessor: 'time' }
        ], []);

    const sort = [
        { Header: '공고명', accessor: 'title' },
        { Header: '마감일', accessor: 'time' }
    ];

    const [originalData, setOriginalData] = useState([]);
    const [dataSet, setDataSet] = useState([]);
    const [sortKey, setSortKey] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isSearchOn, setIsSearchOn] = useState(false);
    const inputRef = useRef(null);

    const comparisonValue = '상시채용';
    const selectHeader = columns[1].Header;
    const selectAccesor = columns[4].accessor;
    const canIndex = true;
    const handleSelect = useCallback((item) => {
        setSortKey(item ? item.Header : null);
    });

    useEffect(() => {
        if (!sortKey) {
          setSortKey(selectHeader);
        }
      }, [sortKey, selectHeader]);
    
    const mutation = useMutation(
        (newKeyword) => axios.post("http://127.0.0.1:8080/companylistsearch", { keyword: newKeyword }),
        {
            onSuccess: (response) => {
                setDataSet(response.data);
                setOriginalData(response.data);
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
            }
        }
    );

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        if(keyword || isSearchOn)  {
            mutation.mutate(keyword);
        } else {
            alert('검색어를 입력해주세요');
        }
        setIsSearchOn(false);
        setKeyword('');
    };

    const data = useMemo(()=> dataSet, [dataSet]);

    useEffect(() => {
        const init = 'ai';
        setKeyword(init);
        setIsSearchOn(true);
      },[]);

    useEffect(() => {
        if (isSearchOn) {
            handleSubmit();
        }
    }, [isSearchOn]);

    return (
    <div className="map_div" style={{padding: '10px', margin: '0 auto'}}>
        <div className={styles.companyContainer}>
            <h2 className={styles.title}>기업 공고 리스트</h2>
                <div className={styles.searchBar}>
                        { !isSearchOn && (
                        <SearchBar
                            columns={columns}
                            handleSubmit={handleSubmit}
                            keyword={keyword}
                            setKeyword={setKeyword}
                            searchOn={inputRef}
                        />)}
                        <CustomDropdown columns={sort} onSelect={handleSelect} header={sort.header} />
                        <SortComponent sortKey={sortKey} originalData={originalData} setDataSet={setDataSet}
                        selectHeader={selectHeader} comparisonValue={comparisonValue} canIndex={canIndex}
                            selectAccesor={selectAccesor}/>
                    </div>
                {mutation.isLoading &&
                <div className={styles.tableContainer}>
                    <Loading loading={mutation.isLoading} text="Loading..." />                    
                    <Table
                            columns={columns}
                            data={dataSet}
                        />
                    </div>
                }
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                {mutation.isSuccess && mutation.data && mutation.data.data && (
                <div className={styles.tableContainer}>
                <Table
                        columns={columns}
                        data={dataSet}
                    />
                </div>

            )}
        </div>
    </div>
);

});

export default CompanyComponent;