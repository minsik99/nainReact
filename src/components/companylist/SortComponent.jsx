import { useEffect } from "react";

const SortComponent = ({
    sortKey,
    originalData,
    selectHeader,
    selectAccesor,
    comparisonValue,
    setDataSet,
    canIndex
}) => {
    const addIndexToData = (data) => {
        return data.map((item, index) => ({
            ...item,
            index: index + 1 // 인덱스는 1부터 시작
        }));
    };

    useEffect(() => {
        const sortData = () => {
            if (originalData.length > 0) {
                const sortedData = [...originalData].sort((a, b) => {
                    if (sortKey !== selectHeader) {
                        if (a[selectAccesor] === comparisonValue && b[selectAccesor] !== comparisonValue) return -1;
                        if (a[selectAccesor] !== comparisonValue && b[selectAccesor] === comparisonValue) return 1;
                        if (a[selectAccesor] === comparisonValue && b[selectAccesor] === comparisonValue) {
                            return a[selectAccesor].localeCompare(b[selectAccesor]);
                        }
                        return new Date(a[selectAccesor]) - new Date(b[selectAccesor]);
                    } else {
                        return a[selectAccesor].localeCompare(b[selectAccesor]);
                    }
                });
                 const finalData = canIndex ? addIndexToData(sortedData) : sortedData;
                 setDataSet(finalData);
            }
        };
        sortData();
    }, [sortKey, originalData, setDataSet, selectHeader]);
    return null;
};



export default SortComponent;
