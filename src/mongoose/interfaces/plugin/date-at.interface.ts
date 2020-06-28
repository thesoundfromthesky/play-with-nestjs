interface DateAtPluginVirtual {
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
}

export interface DateAtPlugin extends DateAtPluginVirtual {
  readonly createdAt: Date;
  updatedAt: Date;
}
