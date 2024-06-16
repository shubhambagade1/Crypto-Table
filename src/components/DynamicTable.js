import React, { useState, useEffect } from "react";
import "./style.css";

const DynamicTable = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [displayCount, setDisplayCount] = useState(20);
    const [favorites, setFavorites] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'ascending' });

    useEffect(() => {
        fetchData();
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("https://api.coincap.io/v2/assets");
            const data = await response.json();
            setCryptoData(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSeeMore = () => {
        setDisplayCount(prevCount => prevCount + 20);
    };

    const addToFavorites = (crypto) => {
        if (favorites.length < 3) {
            const newFavorites = [...favorites, crypto];
            setFavorites(newFavorites);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
        } else {
            alert("You can only add up to 3 favorite currencies.");
        }
    };

    const removeFromFavorites = (id) => {
        const newFavorites = favorites.filter(fav => fav.id !== id);
        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    const isFavorite = (id) => {
        return favorites.some(fav => fav.id === id);
    };

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        
        const sortedData = [...cryptoData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        
        setCryptoData(sortedData);
    };

    return (
        <>
            <div className="fav-section">
                <h2>Favorites</h2>
                <table className="table table-success table-striped-columns">
                    <thead className="table-light">
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Price (USD)</th>
                            <th>Market Cap (USD)</th>
                            <th>Change (24h)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favorites.map((fav, index) => (
                            <tr key={fav.id}>
                                <td>{index + 1}</td>
                                <td>{fav.name}</td>
                                <td>{fav.symbol}</td>
                                <td>${parseFloat(fav.priceUsd).toFixed(2)}</td>
                                <td>${parseFloat(fav.marketCapUsd).toFixed(2)}</td>
                                <td>{parseFloat(fav.changePercent24Hr).toFixed(2)}%</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromFavorites(fav.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1 className="text-center m-4">Cryptocurrency Table</h1>
            <table className="table table-success table-striped-columns">
                <thead className="table-light">
                    <tr className="table-header">
                        <th onClick={() => sortData('rank')}>Rank</th>
                        <th onClick={() => sortData('name')}>Name</th>
                        <th onClick={() => sortData('symbol')}>Symbol</th>
                        <th onClick={() => sortData('priceUsd')}>Price (USD)</th>
                        <th onClick={() => sortData('marketCapUsd')}>Market Cap (USD)</th>
                        <th onClick={() => sortData('changePercent24Hr')}>Change (24h)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoData.slice(0, displayCount).map((crypto, index) => (
                        <tr key={crypto.id}>
                            <td>{index + 1}</td>
                            <td>{crypto.name}</td>
                            <td>{crypto.symbol}</td>
                            <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
                            <td>${parseFloat(crypto.marketCapUsd).toFixed(2)}</td>
                            <td>{parseFloat(crypto.changePercent24Hr).toFixed(2)}%</td>
                            <td>
                                {isFavorite(crypto.id) ? (
                                    <button className="btn btn-secondary" disabled>Added</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => addToFavorites(crypto)}>Add to Favorites</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cryptoData.length > displayCount && (
                <div className="see-more">
                    <button className="btn btn-primary mb-3" onClick={handleSeeMore}>See More</button>
                </div>
            )}
        </>
    );
};

export default DynamicTable;
