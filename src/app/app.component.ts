import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from './app-request-response';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bank-simulator';

  searchAccountDisplay: boolean = true;
  accountDisplay: boolean = false;
  depositDisplay: boolean = false;
  withdrawDisplay: boolean = false;
  transferDisplay: boolean = false;
  accountName: string = "";
  recipientName: string = "";
  currentBalance: number = 0;
  recipientBalance: number = 0;
  account?: Account;
  recipientAccount?: Account;
  amount: number = 0;
  accountNo: string = '';
  recipientAccountNo: string = '';

  constructor(private snackBar: MatSnackBar, private appService: AppService) { }

  ngOnInit() {
    this.getInitialData();
  }

  getInitialData() {
    this.appService.accountsCache.set('100', { name: "Wanjiru", balance: 0, accountNo: '100' });
    this.appService.accountsCache.set('101', { name: "Juma", balance: 0, accountNo: '101' });
    this.appService.accountsCache.set('102', { name: "Linda", balance: 0, accountNo: '102' });
  }

  searchAccount() {
    if (this.accountName === "") {
      this.openSnackBar("Wrong Account Name", 'X', 3000, 'white-snackbar');
      return;
    }

    let account = [...this.appService.accountsCache.values()].find(o =>
      o.name.toLowerCase() === (this.accountName.toLowerCase())
    );

    if (!account) {
      this.openSnackBar("Wrong Account Name", 'X', 3000, 'white-snackbar');
      return;
    } else {
      this.account = account;
      this.accountNo = (this.account?.accountNo === undefined ? '' : this.account.accountNo);
      this.searchAccountDisplay = false;
      this.accountDisplay = true;
      this.depositDisplay = false;
      this.withdrawDisplay = false;
      this.transferDisplay = false;
    }
  }

  cancel() {
    this.amount = 0;
    this.searchAccountDisplay = false;
    this.accountDisplay = true;
    this.depositDisplay = false;
    this.withdrawDisplay = false;
    this.transferDisplay = false;
  }

  openDepositDisplay() {
    this.searchAccountDisplay = false;
    this.accountDisplay = false;
    this.depositDisplay = true;
    this.withdrawDisplay = false;
    this.transferDisplay = false;
  }

  openWithdrawDisplay() {
    this.searchAccountDisplay = false;
    this.accountDisplay = false;
    this.depositDisplay = false;
    this.withdrawDisplay = true;
    this.transferDisplay = false;
  }

  openTransferDisplay() {
    this.recipientName = "";
    this.searchAccountDisplay = false;
    this.accountDisplay = false;
    this.depositDisplay = false;
    this.withdrawDisplay = false;
    this.transferDisplay = true;
  }

  deposit() {
    this.currentBalance = (this.account?.balance === undefined ? 0 : this.account.balance) + this.amount;

    let account: Account = { name: this.accountName, balance: this.currentBalance, accountNo: this.accountNo };

    this.appService.accountsCache.set(this.accountNo, account);

    this.account = account;
    this.openSnackBar("Deposited Successfully", 'X', 3000, 'blue-snackbar');
    this.cancel();
  }

  withdraw() {
    if ((this.account?.balance === undefined ? 0 : this.account.balance) < this.amount) {
      this.openSnackBar("Insufficient balance", 'X', 3000, 'white-snackbar');
      this.cancel();
    } else {
      this.currentBalance = (this.account?.balance === undefined ? 0 : this.account.balance) - this.amount;

      let account: Account = { name: this.accountName, balance: this.currentBalance, accountNo: this.accountNo };

      this.appService.accountsCache.set(this.accountNo, account);

      this.account = account;
      this.openSnackBar("You have withdrawn ksh " + this.amount, 'X', 3000, 'blue-snackbar');
      this.cancel();
    }
  }

  transfer() {
    if (this.recipientName === "" && this.recipientName === this.accountName) {
      this.openSnackBar("Account doesn't exist", 'X', 3000, 'white-snackbar');
      return;
    }

    let recipientAccount = [...this.appService.accountsCache.values()].find(o =>
      o.name.toLowerCase() === (this.recipientName.toLowerCase())
    );

    this.recipientAccount = recipientAccount;

    if (!recipientAccount) {
      this.openSnackBar("Account doesn't exist", 'X', 3000, 'white-snackbar');
      return;
    } else if ((this.account?.balance === undefined ? 0 : this.account.balance) < this.amount) {
      this.openSnackBar("Insufficient balance", 'X', 3000, 'white-snackbar');
      this.cancel();
    } else {

      this.recipientAccountNo = (this.recipientAccount?.accountNo === undefined ? '' : this.recipientAccount.accountNo);

      this.currentBalance = (this.account?.balance === undefined ? 0 : this.account.balance) - this.amount;

      let account: Account = { name: this.accountName, balance: this.currentBalance, accountNo: this.accountNo };

      this.appService.accountsCache.set(this.accountNo, account);

      this.account = account;

      this.recipientBalance = (this.recipientAccount?.balance === undefined ? 0 : this.recipientAccount.balance) + this.amount;

      let recipientAccount: Account = { name: this.recipientName, balance: this.recipientBalance, accountNo: this.recipientAccountNo };
      console.log(this.recipientName, this.recipientAccountNo, this.recipientBalance);
      console.log(this.accountName, this.accountNo, this.currentBalance);
      this.appService.accountsCache.set(this.recipientAccountNo, recipientAccount);

      this.recipientAccount = recipientAccount;
      this.openSnackBar("You have transfered ksh " + this.amount, 'X', 3000, 'blue-snackbar');
      this.cancel();
    }
  }

  goBack() {
    this.accountName = "";
    this.searchAccountDisplay = true;
    this.accountDisplay = false;
    this.depositDisplay = false;
    this.withdrawDisplay = false;
    this.transferDisplay = false;
  }

  openSnackBar(message: string, panelClass: string, seconds: number,
    snackBarClass: string) {
    this.snackBar.open(message, panelClass, {
      duration: seconds,
      verticalPosition: 'top',
      panelClass: [snackBarClass]
    });
  }

}
