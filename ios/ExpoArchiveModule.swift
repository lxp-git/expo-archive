import ExpoModulesCore
import ZIPFoundation
import Foundation

class ProgressObserver: NSObject {
  private let callback: (Double) -> Void
  private var lastReportedProgress: Double = 0.0
  private let progressThreshold: Double
  
  init(threshold: Double = 0.01, callback: @escaping (Double) -> Void) {
    self.progressThreshold = threshold
    self.callback = callback
    super.init()
  }
  
  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "fractionCompleted", let progress = object as? Progress {
      let currentProgress = progress.fractionCompleted
      
      // 检查是否应该报告进度：达到阈值、完成、或首次报告
      let progressDiff = currentProgress - lastReportedProgress
      let shouldReport = progressDiff >= progressThreshold || 
                        currentProgress >= 1.0 || 
                        lastReportedProgress == 0.0
      
      print("Current: \(currentProgress), Last: \(lastReportedProgress), Diff: \(progressDiff), Threshold: \(progressThreshold), Should report: \(shouldReport)")
      
      if shouldReport {
        callback(currentProgress)
        lastReportedProgress = currentProgress
      }
    }
  }
}

public class ExpoArchiveModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoArchive')` in JavaScript.
    Name("ExpoArchive")

    // Defines event names that the module can send to JavaScript.
    Events("onUnzipProgress", "onZipProgress")

    // Archive/Unzip functions
    AsyncFunction("unzipAsync") { (zipPath: String, destinationPath: String, options: [String: Any]?) -> String in
        let fileManager = FileManager.default
        let zipURL = URL(string: zipPath)!
        let destinationURL = URL(string: destinationPath)!
        
        // Parse options
        let overwrite = options?["overwrite"] as? Bool ?? true
        let pathEncoding = options?["pathEncoding"] as? String
        let skipCRC32 = options?["skipCRC32"] as? Bool ?? false
        let allowUncontainedSymlinks = options?["allowUncontainedSymlinks"] as? Bool ?? false
        
        let progress = Progress()
        
        // 创建进度观察者，使用更小的阈值 (0.1% 而不是 1%)
        let observer = ProgressObserver(threshold: 0.001) { fractionCompleted in
            self.sendEvent("onUnzipProgress", [
                "progress": fractionCompleted
            ])
        }
        progress.addObserver(observer, forKeyPath: "fractionCompleted", options: .new, context: nil)
        
        try fileManager.unzipItem(
            at: zipURL,
            to: destinationURL,
            skipCRC32: skipCRC32,
            allowUncontainedSymlinks: allowUncontainedSymlinks,
            progress: progress,
            pathEncoding: nil
        )
        
        progress.removeObserver(observer, forKeyPath: "fractionCompleted")
        
        return destinationPath
    }
    
    AsyncFunction("zipAsync") { (sourcePath: String, zipPath: String, options: [String: Any]?) -> String in
        let fileManager = FileManager.default
        let sourceURL = URL(string: sourcePath)!
        let zipURL = URL(string: zipPath)!
        
        // Parse options
        let compressionMethod = options?["compressionMethod"] as? String ?? "deflate"
        let shouldKeepParent = options?["shouldKeepParent"] as? Bool ?? false

        let progress = Progress()
        
        // 创建进度观察者，使用更小的阈值 (0.1% 而不是 1%)
        let observer = ProgressObserver(threshold: 0.001) { fractionCompleted in
            self.sendEvent("onZipProgress", [
                "progress": fractionCompleted
            ])
        }
        progress.addObserver(observer, forKeyPath: "fractionCompleted", options: .new, context: nil)
        
        try fileManager.zipItem(
            at: sourceURL,
            to: zipURL,
            shouldKeepParent: shouldKeepParent,
            compressionMethod: .deflate,
            progress: progress
        )
        
        progress.removeObserver(observer, forKeyPath: "fractionCompleted")
        
        return zipPath
    }
  }
}
