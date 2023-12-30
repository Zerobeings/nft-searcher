import React, { useState, useEffect, useMemo } from 'react';
import getMixtapeNFTs from 'nft-fetcher';
import styles from './index.module.css';
import {
    MediaRenderer,
    useNFTs,
    useContract,
} from "@thirdweb-dev/react";

interface SearchBarProps {
    activeNetwork?: string;
    limit?: number;
    start?: number;
    where?: string[];
    select?: string;
    dbURL?: string;
    theme?: string;
    onNFTsFetched?: (nfts: any[]) => void;
    style?: {
        searchBarContainer?: React.CSSProperties;
        selectNetwork?: React.CSSProperties;
        searchBar?: React.CSSProperties;
        searchBarMatic?: React.CSSProperties;
        clearButton?: React.CSSProperties;
        suggestionsContainer?: React.CSSProperties;
        suggestion?: React.CSSProperties;
        suggestionLogo?: React.CSSProperties;
    };
    classNames?: {
        searchBarContainer?: string;
        selectNetwork?: string;
        searchBar?: string;
        searchBarMatic?: string;
        clearButton?: string;
        suggestionsContainer?: string;
        suggestion?: string;
        suggestionLogo?: string;
    };
}

interface Collection {
    name?: string;
    contract?: string;
    image?: string;
    symbol?: string;
}


interface Collections {
    [key: string]: Collection[];
}

const NFTSearcher = ({
    activeNetwork, 
    limit, 
    start, 
    where, 
    select, 
    dbURL,
    theme, 
    onNFTsFetched, 
    style = {
        searchBarContainer: {},
        selectNetwork: {},
        searchBar: {},
        searchBarMatic: {},
        clearButton: {},
        suggestionsContainer: {},
        suggestion: {},
        suggestionLogo: {},
    },
    classNames = {
        searchBarContainer: "",
        selectNetwork: "",
        searchBar: "",
        searchBarMatic: "",
        clearButton: "",
        suggestionsContainer: "",
        suggestion: "",
        suggestionLogo: "",
    }}:SearchBarProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [twContractAddress, setTWContractAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionCache, setCollectionCache] = useState<Collections>({});
  const darkTheme = useMemo(() => theme === 'dark', [theme]);
  onNFTsFetched = onNFTsFetched || (() => {});

  const darkMode = useMemo(() => ({
    searchBarContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarContainer,
    },
    searchBar: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBar,
    },
    searchBarMatic: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarMatic,
    },
    suggestionsContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionsContainer,
    },
    suggestionLogo: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionLogo,
    },
 }), [darkTheme, style]);

    useEffect(() => {
        if (activeNetwork) {
            setNetwork(activeNetwork);
        }
    }
    , [activeNetwork]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setContractAddress(query);
        setShowSuggestions(query !== '');
    };
    
    const handleClearSearch = () => {
        setContractAddress('');
        setShowSuggestions(false);
    };

    const { contract } = useContract(twContractAddress);
    const {data: nfts, isLoading: isLoading } = useNFTs(contract,{
        count: limit,
        start: start,
    });
    const [isNFTsFetched, setIsNFTsFetched] = useState(false);

    useEffect(() => {
        if (nfts && nfts.length > 0) {
            setIsNFTsFetched(true);
            onNFTsFetched(nfts);
        }
    }, [nfts]);

    useEffect(() => {
        setIsNFTsFetched(false);
    }, [contract]);

    const handleSuggestionClick = (search: string) => {
        if (!isNFTsFetched) {
            console.log('Waiting for NFTs to be fetched...');
            return;
        }
        setIsProcessing(true);
        setContractAddress('');
        setShowSuggestions(false);
        console.log('Fetching NFTs...');
        getMixtapeNFTs(search, network,
                {
                    limit,
                    start,
                    where,
                    select,
                    dbURL,
                }
            )
            .then((results:any) => {
                console.log('NFTs fetched!');
                if (onNFTsFetched) {
                    onNFTsFetched(results);
                }
                setIsProcessing(false);
            })
            .catch((e:any) => {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                    console.log(`If collection is missing, submit an index request at https://indexer.locatia.app`);
                } else {
                    console.error('Caught an unknown error:', e);
                }
                setIsProcessing(false);
            });
    };
    
    
    useEffect(() => {
        const fetchCollections = async () => {
            // Check cache first
            if (collectionCache[network]) {
                setCollections(collectionCache[network]);
                return;
            }
        
            try {
                let url;
                switch (network) {
                    case "ethereum":
                        url = "https://lib.locatia.app/eth-directory/directory.json";
                        break;
                    case "polygon":
                        url = "https://lib.locatia.app/poly-directory/directory.json";
                        break;
                    default:
                        url = "https://lib.locatia.app/eth-directory/directory.json";
                }
        
                const response = await fetch(url);
                const data = await response.json();
                
                setCollections(data);
                setCollectionCache({ ...collectionCache, [network]: data });
            } catch (error) {
                console.error(`Suggestions: ${error}`);
            }
        };
        fetchCollections();
   
    }, [network, collectionCache]);

    
  return (
    <div>
        <div className={`${styles.searchBarContainer} ${classNames.searchBarContainer || ""}`} 
        style={style.searchBarContainer && darkMode ? darkMode.searchBarContainer : style.searchBarContainer}>
         {network === "ethereum" ? (
                <img 
                    className={styles.networkImage}
                    src="https://lib.locatia.app/network-images/eth.png"
                    alt="ethereum"
                    width={30} 
                    height={30}
                    loading="lazy"
                />
            ) : network === "polygon" && (
                <img 
                    className={styles.networkImage}
                    src="https://lib.locatia.app/network-images/matic.png"
                    alt="polygon"
                    width={30} 
                    height={30}
                    loading="lazy"
                />
            )    
            }
            <input
                style={style.searchBar && darkMode ? darkMode.searchBar : style.searchBar}
                className={`${network === "ethereum" ? styles.searchBar : styles.searchBarMatic} ${styles.searchBar || ""}`}
                type="text"
                value={contractAddress}
                placeholder="Name/Contract Address"
                onChange={handleInputChange}
                onKeyPress={event => {
                    if (event.key === 'Enter' && contractAddress) {
                        setTWContractAddress(contractAddress);
                        handleSuggestionClick(contractAddress);
                        };
                    }}
                disabled={isProcessing}
            />
            {contractAddress && (
            <button 
                style={style.clearButton}
                className={`${styles.clearButton} ${classNames.clearButton || ""}`} 
                onClick={handleClearSearch} 
                aria-label="Clear search"
            >
                X
            </button>
            )}
        </div>
        {showSuggestions && (
        <div
            style={style.suggestionsContainer && darkMode ? darkMode.suggestionsContainer : style.suggestionsContainer}
            className={`${styles.suggestionsContainer} ${classNames.suggestionsContainer || ""} `}
        >
          {collections && collections
              .filter((collection) =>
              {return collection.name && collection.name.toLowerCase().includes(contractAddress.toLowerCase())}
              )
              .slice(0, 6)
              .map((collection, index) => (
                <div
                    key={index}
                    style={style.suggestion}
                    className={`${styles.suggestion} ${classNames.suggestion || ""}`}
                    onClick={() => {
                        if (collection.contract){
                        setTWContractAddress(collection.contract);
                        handleSuggestionClick(collection.contract);
                        }
                    }}
                >
                    <MediaRenderer 
                        src={collection.image} 
                        alt={collection.contract}
                        style={style.suggestionLogo}
                        className={`${styles.suggestionLogo} ${classNames.suggestionLogo || ""}`} 
                        width={"20px"} 
                        height={"20px"}
                    />
                    <span>{collection.name}</span>
                </div>
            ))}
        </div>
        )}
    </div>
  );
};

export default NFTSearcher;
