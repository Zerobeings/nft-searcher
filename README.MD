# NFTSearcher

NFTSearcher is a React component that provides a search bar for fetching and displaying NFTs from different networks. It uses the `nft-fetcher` library to fetch NFTs based on the user's search input.

## Quick Start Method

The quickest way to get started is to use the nextjs nft-searcher-template repository.

```bash
git clone https://github.com/Zerobeings/nft-searcher-template.git
cd nft-searcher-template
yarn install
```

## Installation

```bash
yarn add nft-searcher
```

nft-searcher has three peer dependencies: `react`, `react-dom`, `@thirdweb-dev/react`. Make sure they are installed in your project.

```bash
yarn add react react-dom @thirdweb-dev/react
```

## Usage

Create a component in your project and import the `NFTSearcher` component from the `nft-searcher` package.

```jsx
import NFTSearcher from "nft-searcher"
import { useState, useEffect, useCallback } from "react";

export default function NFTSearcherPackNOSSR(){
  const [fetchedNFTs, setFetchedNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

    const handleNFTsFetched = useCallback((nfts: any[]) => {
    setLoading(true);
    setFetchedNFTs(nfts);
    setInterval(() => {
        setLoading(false);
    }, 1000);
}, [setLoading, setFetchedNFTs]);

  return (
    <div>
      <NFTSearcher 
        activeNetwork={"ethereum"}
        theme={"dark"}
        onNFTsFetched={handleNFTsFetched}
        />
    </div>
  )
}
```

Next, dynamically import the `NFTSearcherPackNOSSR` component in your page.

```jsx
import dynamic from "next/dynamic";
const NFTSearcherPackNOSSR = dynamic(() => import('../components/NFTSearcher/Searcher'), { ssr: false });

export default function Home() {
  return (
    <div>
      <NFTSearcherPackNOSSR />
    </div>
  )
}
```

## Props

- `activeNetwork`: The active blockchain network. Default is 'ethereum'.
- `limit`: The maximum number of NFTs to fetch.
- `start`: The starting index for fetching NFTs.
- `where`: An array of conditions for fetching NFTs.
- `select`: The fields to select from the fetched NFTs.
- `dbURL`: The URL of the database to fetch NFTs from.
- `theme`: The theme of the search bar. Can be 'dark' or 'light'.
- `onNFTsFetched`: A callback function that is called when NFTs are fetched. It receives the fetched NFTs as an argument.
- `style`: An object containing CSS styles for various elements of the search bar.
- `classNames`: An object containing class names for various elements of the search bar.

## Styles and ClassNames

You can customize the appearance of the search bar by providing CSS styles and class names for various elements. The `style` prop is an object where the keys are the names of the elements and the values are CSS style objects. The `classNames` prop is similar, but the values are class names.

Here's an example of how you can use the `style` and `classNames` props to customize the appearance of the NFTSearcher component:

```jsx
import NFTSearcher from 'nft-searcher';

<NFTSearcher
  activeNetwork={"ethereum"}
  limit={10}
  start={0}
  where={[]} // for nft-indexer collections only, not used for thirdweb contract fetches
  select={"*"} // for nft-indexer collections only, not used for thirdweb contract fetches
  dbURL={""} // for nft-indexer collections only, not used for thirdweb contract fetches
  theme={"dark"} // or "light"
  onNFTsFetched={(nfts) => console.log(nfts)}
  style={{
    searchContainer: {
      backgroundColor: '#f5f5f5',
      padding: '10px',
    },
    searchInput: {
      fontSize: '18px',
      padding: '10px',
    },
    searchButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
    },
    resultsContainer: {
      marginTop: '20px',
    },
    resultItem: {
      borderBottom: '1px solid #ddd',
      padding: '10px 0',
    },
  }}
  classNames={{
    searchContainer: 'my-search-container',
    searchInput: 'my-search-input',
    searchButton: 'my-search-button',
    resultsContainer: 'my-results-container',
    resultItem: 'my-result-item',
  }}
/>
```

In this example, the `style` prop is used to provide CSS styles for the search container, search input, search button, results container, and result items. The `classNames` prop is used to provide custom class names for the same elements.

Please note that the actual style and class names that you can use will depend on the implementation of the NFTSearcher component. The keys used in the `style` and `classNames` objects (like `searchContainer`, `searchInput`, etc.) are just examples and might not correspond to the actual elements in the NFTSearcher component. You'll need to refer to the NFTSearcher documentation or source code to find out the correct keys to use.


## Fetching NFTs

When the user types in the search bar, the component fetches NFTs that match the user's input. The fetched NFTs are passed to the `onNFTsFetched` callback function.

Suggestions are displayed in a dropdown menu below the search bar. The user can click on a suggestion to select it. When a suggestion is selected, the `onNFTsFetched` callback function is called with the selected NFTs as an argument.

A contract address can also be entered in the search bar. When a contract address is entered, the component fetches all the NFTs from that contract and passes them to the `onNFTsFetched` callback function.

If a collection does not appear it has not been indexed yet. To request a collection to be indexed, please submit a request at https://indexer.locatia.app. Once the collection is indexed it will also appear in the suggestions dropdown.

If you would like your thirdweb collection added to the directory, please open an issue at https://github.com/Zerobeings/nft-indexer with the collection name and contract address.

## Network Support

The component supports multiple blockchain networks. The active network can be set using the `activeNetwork` prop. The default network is 'ethereum'.

The following networks are supported:
- Ethereum: "ethereum"
- Polygon: "polygon"
- Fantom Opera: "fantom"
- Avalanche: "avalanche"

## Next js configuration

Step 1: Update next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  }
};

module.exports = nextConfig;
```

Step 2: Under the `public` folder create a folder named `db` and add the `sql-wasm-595817d88d82727f463bc4b73e0a64cf.wasm` file to it. You can download the file from [here](https://github.com/Zerobeings/nft-indexer/tree/main/nextjs-db-file) or in the src file of this package.

Step 3: Create an nft-searcher.d.ts file under the `typings` folder of your project and the following declaration.
```javascript
declare module 'nft-searcher';
```

## License

[MIT](https://choosealicense.com/licenses/mit/)