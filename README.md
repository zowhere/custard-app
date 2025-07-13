![](https://raw.githubusercontent.com/Custard-Technology/custard-app/refs/heads/main/frontend/public/hom2.png)

# Custard: Loyalty points Program
# Structure 
```
/contract
    ├── artificats/               #artifacts
    ├── cache/                    # Cache
    ├── contracts/ scripts       # Contracts
    ├── scripts/         # Custom hooks
```
```   
/frontend
    ├── App/Api/dashboard/ onboarding       # Main entry point #API
    ├── Artificats/contracts                # Artifacts
    ├── Components/UI                       # Reusable UI components
    ├── hooks/                              #Custom hooks
    ├── lib/        
    ├── public/        
    ├── Store/
```

## Prerequisite
- npm
npm install npm@latest -g



## .env set up
```
MONGODB_URI=
RESEND_API=
FACTORY_CONTRACT_ADDRESS=
RPC_URL=
PUBLIC_KEY=
PRIVATE_KEY=
ENV=
LINK=
DATABASE=
```
   
## Getting started

### Contract
```
    cd contract
    npm install
    npx hardhat deploy
    npm run deploy:primodial
```

### Frontend
```
    cd frontend
    npm install
    npm run dev
```



