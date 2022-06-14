A **program** is to Solana what a **smart contract** is to other protocols. Once a program has been deployed, any app can interact with it by sending a transaction containing the program instructions to a Solana cluster, which will pass it to the program to be run.

{% hint style="info" %}
[Click here to learn more about Solana's programs](https://docs.solana.com/developing/on-chain-programs/overview).
{% endhint %}

# 🧐 Smart contract review

The Rust source code for the program we will deploy is located in `contracts/solana/program/src/lib.rs`. The `contracts/solana/program/` directory contains some configuration files to help us compile and deploy it.

**It's a simple program, all it does is increment a number every time it's called.**

Let’s dissect what each part does.

```rust
// contracts/solana/program/src/lib.rs
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
```

In Rust, [`use` declarations](https://doc.rust-lang.org/reference/items/use-declarations.html) are convenient shortcuts to other code. In this case, the serialize and de-serialize functions from the [borsh](https://borsh.io/) crate. borsh stands for _**B**inary **O**bject **R**epresentation **S**erializer for **H**ashing_.  
A [crate](https://learning-rust.github.io/docs/a4.cargo,crates_and_basic_project_structure.html#Crate) is a collection of source code which can be distributed and compiled together. Learn more about [Cargo, Crates and basic project structure](https://learning-rust.github.io/docs/a4.cargo,crates_and_basic_project_structure.html).

We also `use` portions of the `solana_program` crate :

- A function to return the next `AccountInfo` as well as the struct for `AccountInfo`.
- The `entrypoint` macro and related `entrypoint::ProgramResult`.
- The `msg` macro, for low-impact logging on the blockchain.
- `program_error::ProgramError` which allows on-chain programs to implement program-specific error types and see them returned by the Solana runtime. A program-specific error may be any type that is represented as or serialized to a u32 integer.
- The `pubkey::Pubkey` struct.

Next, we will use the `derive` macro to generate all the necessary boilerplate code to wrap our `GreetingAccount` struct. This happens behind the scenes during compile time [with any `#[derive()]` macros](https://doc.rust-lang.org/reference/procedural-macros.html#derive-macros). Rust macros are a rather large topic to take in, but well worth the effort to understand. For now, just know that this is a shortcut for boilerplate code that is inserted at compile time.

The struct declaration itself is simple, we are using the `pub` keyword to declare our struct publicly accessible, meaning other programs and functions can use it. The `struct` keyword is letting the compiler know that we are defining a struct named `GreetingAccount`, which has a single field: `counter` with a type of `u32`, an unsigned 32-bit integer. This means our counter cannot be larger than [`4,294,967,295`](https://en.wikipedia.org/wiki/4,294,967,295).

```rust
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
    pub counter: u32,
}
```

Next, we declare an entry point - the `process_instruction` function :

```rust
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello World Rust program entrypoint");
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
```

- The return value of the `process_instruction` entrypoint will be a `ProgramResult` .  
  [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) comes from the `std` crate and is used to express the possibility of error.
- For [debugging](https://docs.solana.com/developing/on-chain-programs/debugging), we can print messages to the Program Log [with the `msg!()` macro](https://docs.rs/solana-program/1.7.3/solana_program/macro.msg.html), rather than use `println!()` which would be prohibitive in terms of computational cost for the network.
- The `let` keyword in Rust binds a value to a variable. By looping through the `accounts` using an [iterator](https://doc.rust-lang.org/book/ch13-02-iterators.html), `accounts_iter` is taking a [mutable reference](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references) of each value in `accounts`. Then `next_account_info(accounts_iter)?`will return the next `AccountInfo` or a `NotEnoughAccountKeys` error. Notice the `?` at the end, this is a [shortcut expression](https://doc.rust-lang.org/std/result/#the-question-mark-operator-) in Rust for [error propagation](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#propagating-errors).

```rust
if account.owner != program_id {
  msg!("Greeted account does not have the correct program id");
  return Err(ProgramError::IncorrectProgramId);
}
```

We will perform a security check to see if the account owner has permission. If the `account.owner` public key does not equal the `program_id` we will return an error.

```rust
let mut greeting_account = GreetingAccount::try_from_slice(&account.data.borrow())?;
greeting_account.counter += 1;
greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

msg!("Greeted {} time(s)!", greeting_account.counter);

Ok(())
```

Finally, we get to the good stuff where we "borrow" the existing account data, increase the value of `counter` by one and write it back to storage.

- The `GreetingAccount` struct has only one field - `counter`. To be able to modify it, we need to borrow the reference to `account.data` with the `&` [borrow operator](https://doc.rust-lang.org/reference/expressions/operator-expr.html#borrow-operators).
- The `try_from_slice()` function from `BorshDeserialize` will mutably reference and deserialize the `account.data`.
- The `borrow()` function comes from the Rust core library, and exists to immutably borrow the wrapped value.

Taken together, this is saying that we will borrow the account data and pass it to a function that will deserialize it and return an error if one occurs. Recall that `?` is for error propagation.

Next, incrementing the value of `counter` by 1 is simple, using the addition assignment operator : `+=`.

With the `serialize()` function from `BorshSerialize`, the new `counter` value is sent back to Solana in the correct format. The mechanism by which this occurs is the [Write trait](https://doc.rust-lang.org/std/io/trait.Write.html) from the `std::io` crate.

We can then show in the Program Log how many times the count has been incremented by using the `msg!()` macro.

---

# 💻 Set up the Solana CLI

## Install Rust and Solana CLI

So far we've been using Solana's JS API to interact with the blockchain. To deploy a Solana program, we'll use another Solana developer tool: their Command Line Interface (CLI). We'll install it and use it through our terminal.

For simplicity, perform both of these installations inside the project root (`/learn-web3-dapp/`):

{% hint style="info" %}
If you're using Gitpod the Rust toolchain is already installed, but you will still need to install the Solana CLI.
{% endhint %}

[**Install the latest Rust stable**](https://rustup.rs) :

```text
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Developers using macOS may want to use the following commands instead:

```text
curl https://sh.rustup.rs -sSf | bash -s -- -y --no-modify-path
source $HOME/.cargo/env
```

[**Install the Solana CLI**](https://docs.solana.com/cli/install-solana-cli-tools):

```text
sh -c "$(curl -sSfL https://release.solana.com/v1.10.25/install)"
```

---

## Set up Solana CLI

We need to configure the Solana cluster, create an account, request an airdrop and check that everything is functioning properly before we deploy our program.

Set the CLI config URL to the devnet cluster:

```text
solana config set --url https://api.devnet.solana.com
```

Next, we're going to generate a new keypair using the CLI. Run the following command in your terminal:

{% hint style="info" %}
Make sure you're running these commands from the `/learn-web3-dapp/` directory, which is the **root directory** of the repository.
{% endhint %}

```text
mkdir solana-wallet
solana-keygen new --outfile solana-wallet/keypair.json
```

You will need **SOL** available in the account to deploy the program, so get an airdrop with:

```text
solana airdrop 1 $(solana-keygen pubkey solana-wallet/keypair.json)
```

{% hint style="info" %}
In a Windows terminal, the `$( )` syntax does not work, so just paste the public key you want to fund after the airdrop amount - for example: `solana airdrop 1 C1qx2QUZq7EyLZao4U98fRb8HkT3X5fsGWUc25VyCRBn`
{% endhint %}

Verify that everything is configured and the address is now funded with 1 SOL:

```text
solana config get
solana account $(solana-keygen pubkey solana-wallet/keypair.json)
```

---

# 🧩 Deploy a Solana program

The program we're going to deploy keeps track of the number of times an account has sent a greeting instruction to it. This is an effective demonstration of how storage works on Solana.

## 🧱 Building the program

The first thing we're going to do is compile the Rust program to prepare it for the CLI. To do this we're going to use a custom script that's defined in `package.json`. Let's run the script and build the program by running the following command in the terminal (from the project root directory):

{% hint style="tip" %}
This step can take a few minutes!
{% endhint %}

```text
yarn run solana:build:program
```

{% hint style="tip" %}
If you have cloned the repo locally and you are using WSL or Linux, you might get an **error: linker `cc` not found** when compiling the Solana program. You will need to install the **build-essential** package by running `sudo apt install build-essential`, or the install command for your specific Linux distribution.
{% endhint %}

When it's successful, you will see the instructions to execute the deploy command with the path to the compiled program named `helloworld.so`. While this would work, we want to specify the keypair we generated just for this purpose, so read on.

```text
To deploy this program:
  $ solana program deploy /home/zu/project/figment/learn-web3-dapp/dist/solana/program/helloworld.so
Done in 1.39s.
```

{% hint style="info" %}
The `.so` extension does not stand for Solana! It stands for "shared object". You can learn more about Solana Programs in the [developer documentation](https://docs.solana.com/developing/on-chain-programs/overview).
{% endhint %}

---

## ⛓ Deploying the program

Now we're going to deploy the program to the devnet cluster. The CLI provides a simple interface for this, `solana deploy`:

{% hint style="info" %}
Make sure you're running this command from the `/learn-web3-dapp/` directory, which is the **root directory** of the repository (otherwise, you would need to change the paths to the `keypair.json` and the `helloworld.so` file).
{% endhint %}

```text
solana deploy -v --keypair solana-wallet/keypair.json dist/solana/program/helloworld.so
```

The `-v` Verbose flag is optional, but it will show some related information like the RPC URL and path to the default signer keypair, as well as the expected [**Commitment level**](https://docs.solana.com/implemented-proposals/commitment). When the process completes, the Program Id will be displayed :

On success, the CLI will print the **programId** of the deployed contract.

```text
RPC URL: https://api.devnet.solana.com
Default Signer Path: solana-wallet/keypair.json
Commitment: confirmed
Program Id: 7KwpCaaYXRsjfCTvf85eCVuZDW894zZNN38UMxMpQoaQ
```

## ⛓ Deploying the program to a test validator inside Gitpod

First, you will need to change the Solana CLI target cluster with the terminal command:

```text
solana config set --url http://127.0.0.1:8899
```

Next, run a test validator using the terminal command:

```text
solana-test-validator
```

This will have similar output as shown below, and prevent you from entering other commands into the terminal where you run `solana-test-validator` until you stop the process with `Ctrl+C`:

```text
Ledger location: test-ledger
Log: test-ledger/validator.log
 Initializing...
 Initializing...
Identity: HsrXahBfC7ZbxovF78k9SiY7UZ43MmkyiWDsJi6bM7u4
Genesis Hash: 3m667qKgVF3a97rRWWbHLX1U2YbeAEgHqzEDjBiXgPsH
Version: 1.9.5
Shred Version: 44724
Gossip Address: 127.0.0.1:1024
TPU Address: 127.0.0.1:1027
JSON RPC URL: http://127.0.0.1:8899
 00:00:20 | Processed Slot: 46 | Confirmed Slot: 46 |
```

Open a new terminal in Gitpod (or split the one running the test validator). In this new terminal, you will need to add the location of the Solana CLI to your PATH with the command:

```text
export PATH="/home/gitpod/.local/share/solana/install/active_release/bin:$PATH"
```

Make sure your keypair in `/solana-wallet/keypair.json` has a SOL balance to pay for the deployment by airdropping it some SOL (and since it's on a test validator, you can specify a much higher amount of SOL):

```text
solana airdrop 100 $(solana-keygen pubkey solana-wallet/keypair.json)
```

You can now deploy the program to the test validator with the command:

```text
solana deploy -v --keypair solana-wallet/keypair.json dist/solana/program/helloworld.so
```

The last thing to change is the selected cluster in the Pathway UI. Go back to the "Connect to Solana" step using the navigation buttons at the bottom of the screen, there you can pick the **localnet** option from the Network dropdown on the top of the page. Don't forget to repeat the airdrop step, to make sure that the keypair is funded with SOL. You can now proceed with the code challenge and the Pathway will check the test validator for the deployed program instead of devnet, circumventing the issue with Gitpod! 😅

---

# 🏋️ Challenge

{% hint style="tip" %}
Before moving to the next step, we need to check that our program has been correctly deployed! For this, we'll need the `programId` of the program. Copy & paste it into the text input, then try to figure out how to complete the code for `pages/api/solana/deploy.ts`.
{% endhint %}

**Take a few minutes to figure this out.**

```tsx
//...
  try {
    const {network, programId} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    // Get the publicKey of the programId and get its account info
    const publicKey = undefined;
    const programInfo = undefined;

    if (programInfo === null) {
      if (fs.existsSync(PROGRAM_SO_PATH)) {
        throw new Error(
          'Program needs to be deployed with `solana deploy`',
        );
      } else {
        throw new Error('Program needs to be built and deployed');
      }
    } else if (!programInfo.executable) {
      throw new Error(`Program is not executable`);
    }

    res.status(200).json(true);
  }
//...
```

**Need some help?** Check out these links 👇

- [How to get account info](https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getAccountInfo)
- [Is an account executable?](https://solana-labs.github.io/solana-web3.js/modules.html#AccountInfo)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```tsx
// solution
//...
  try {
    const {network, programId} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = new PublicKey(programId);
    const programInfo = await connection.getAccountInfo(publicKey);

    if (programInfo === null) {
      if (fs.existsSync(PROGRAM_SO_PATH)) {
        throw new Error(
          'Program needs to be deployed with `solana deploy`',
        );
      } else {
        throw new Error('Program needs to be built and deployed');
      }
    } else if (!programInfo.executable) {
      throw new Error(`Program is not executable`);
    }

    res.status(200).json(true);
  }
//...
```

**What happened in the code above?**

- We create a new `PublicKey` instance from the `programId` string formatted address.
- Once we have it, we call the `getAccountInfo` method to check the info available for this address.
  - If none, then no account is linked to this address, meaning the program has not yet been deployed.
- Then we check if the account's executable property is true. If it is, then the specified account contains a loaded program.
- Finally, we send a value of `true` to the client-side in JSON format.

---

# ✅ Make sure it works

Once the code in `pages/api/solana/deploy.ts` is complete, copy & paste the Program Id from the deployment step into the text input, then click on **Check Deployment**.

---

# 🏁 Conclusion

So at this point, we've deployed our program to Solana's devnet cluster and checked that it went smoothly. Now it's time to create an account that is owned by our program, to store some data on the Solana cluster!
