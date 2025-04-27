package io.ionic.starter;

import android.os.Bundle;

import com.capacitorjs.community.plugins.bluetoothle.BluetoothLe;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;


import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Registro de los plugins utilizados en la aplicación
    ArrayList<Class<? extends Plugin>> additionalPlugins = new ArrayList<>();
    additionalPlugins.add(BluetoothLe.class);

    registerPlugins(additionalPlugins);
  }
}
