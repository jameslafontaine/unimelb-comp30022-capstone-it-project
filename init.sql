SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Create schema
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8mb3 ;
USE `db` ;

-- -----------------------------------------------------
-- Create tables
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `db`.`User` (
  `userId` INT NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `emailNotifications` BIT(1) NOT NULL DEFAULT 0,
  `darkMode` BIT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Course` (
  `courseId` INT NOT NULL,
  `courseName` VARCHAR(100) NOT NULL,
  `courseCode` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`courseId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Assignment` (
  `assignmentId` INT NOT NULL,
  `courseId` INT NOT NULL,
  `assignment_type` VARCHAR(45) NOT NULL,
  `assignment_weightage` INT NULL DEFAULT NULL,
  `start_date` DATETIME NULL DEFAULT NULL,
  `due_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`assignmentId`),
  INDEX `fk_assignments_course (subject)1_idx` (`courseId` ASC) VISIBLE,
  CONSTRAINT `fk_assignments_course (subject)1`
    FOREIGN KEY (`courseId`)
    REFERENCES `db`.`Course` (`courseId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Case` (
  `caseId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `Date_updated` DATE NOT NULL,
  `Date_created` DATE NOT NULL,
  PRIMARY KEY (`caseId`, `userId`),
  INDEX `fk_case_users1_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `fk_case_users1`
    FOREIGN KEY (`userId`)
    REFERENCES `db`.`User` (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Thread` (
  `threadId` INT NOT NULL AUTO_INCREMENT,
  `caseId` INT NOT NULL,
  `courseId` INT NOT NULL,
  `requestType` VARCHAR(8) NOT NULL,
  `complexCase` BIT(1) NOT NULL,
  `currentStatus` INT NOT NULL DEFAULT 0,
  `assignmentId` INT NULL,
  PRIMARY KEY (`threadId`, `caseId`, `courseId`),
  INDEX `fk_thread_case1_idx` (`assignmentId` ASC) VISIBLE,
  INDEX `fk_thread_case2_idx` (`caseId` ASC) VISIBLE,
  INDEX `fk_Thread_Course1_idx` (`courseId` ASC) VISIBLE,
  CONSTRAINT `fk_thread_case1`
    FOREIGN KEY (`assignmentId`)
    REFERENCES `db`.`Assignment` (`assignmentId`),
  CONSTRAINT `fk_thread_case2`
    FOREIGN KEY (`caseId`)
    REFERENCES `db`.`Case` (`caseId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Thread_Course1`
    FOREIGN KEY (`courseId`)
    REFERENCES `db`.`Course` (`courseId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Request` (
  `requestId` INT NOT NULL AUTO_INCREMENT,
  `threadId` INT NOT NULL,
  `messageBody` VARCHAR(1000) NOT NULL,
  `instructorNotes` VARCHAR(1000) NULL,
  PRIMARY KEY (`requestId`, `threadId`),
  INDEX `fk_extension request_thread1_idx` (`threadId` ASC) VISIBLE,
  CONSTRAINT `fk_extension request_thread1`
    FOREIGN KEY (`threadId`)
    REFERENCES `db`.`Thread` (`threadId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`File` (
  `fileId` INT NOT NULL AUTO_INCREMENT,
  `file` BLOB NOT NULL,
  `fileType` VARCHAR(18) NOT NULL COMMENT 'aap or supportingDocument',
  `userId` INT NULL DEFAULT NULL,
  `requestId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`fileId`),
  INDEX `fk_aap_users1_idx` (`userId` ASC) VISIBLE,
  INDEX `meow_idx` (`requestId` ASC) VISIBLE,
  CONSTRAINT `fk_aap_users1`
    FOREIGN KEY (`userId`)
    REFERENCES `db`.`User` (`userId`),
  CONSTRAINT `meow`
    FOREIGN KEY (`requestId`)
    REFERENCES `db`.`Request` (`requestId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`Enrollment` (
  `enrollmentId` INT NOT NULL,
  `courseId` INT NOT NULL,
  `userId` INT NOT NULL,
  `enrollmentRole` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`enrollmentId`, `courseId`, `userId`),
  INDEX `fk_Course (subject)_has_users_users1_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_Course (subject)_has_users_Course (subject)1_idx` (`courseId` ASC) VISIBLE,
  CONSTRAINT `course id`
    FOREIGN KEY (`courseId`)
    REFERENCES `db`.`Course` (`courseId`),
  CONSTRAINT `user id`
    FOREIGN KEY (`userId`)
    REFERENCES `db`.`User` (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`CoursePreferences` (
  `coursePreferenceId` INT NOT NULL AUTO_INCREMENT,
  `courseId` INT NOT NULL,
  `defaultExtensionLength` INT NOT NULL DEFAULT '3',
  `generalTutor` BIT(1) NOT NULL DEFAULT 1,
  `extensionTutor` BIT(1) NOT NULL DEFAULT 1,
  `quizTutor` BIT(1) NOT NULL DEFAULT 1,
  `remarkTutor` BIT(1) NOT NULL DEFAULT 1,
  `otherTutor` BIT(1) NOT NULL DEFAULT 1,
  `generalSc` BIT(1) NOT NULL DEFAULT 1,
  `extensionSc` BIT(1) NOT NULL DEFAULT 1,
  `quizSc` BIT(1) NOT NULL DEFAULT 1,
  `remarkSc` BIT(1) NOT NULL DEFAULT 1,
  `otherSc` BIT(1) NOT NULL DEFAULT 1,
  `generalReject` VARCHAR(1000) NULL DEFAULT NULL,
  `extensionApprove` VARCHAR(1000) NULL DEFAULT NULL,
  `extensionReject` VARCHAR(1000) NULL DEFAULT NULL,
  `quizApprove` VARCHAR(1000) NULL DEFAULT NULL,
  `quizReject` VARCHAR(1000) NULL DEFAULT NULL,
  `remarkApprove` VARCHAR(1000) NULL DEFAULT NULL,
  `remarkReject` VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`coursePreferenceId`, `courseId`),
  INDEX `fk_settings_course (subject)1_idx` (`courseId` ASC) VISIBLE,
  CONSTRAINT `fk_settings_course (subject)1`
    FOREIGN KEY (`courseId`)
    REFERENCES `db`.`Course` (`courseId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `db`.`AssignmentExtensionLength` (
  `coursePreferenceId` INT NOT NULL,
  `assignmentId` INT NOT NULL,
  `extensionLength` INT NOT NULL,
  PRIMARY KEY (`coursePreferenceId`, `assignmentId`),
  INDEX `fk_AssignmentExtensionLength_CoursePreferences1_idx` (`coursePreferenceId` ASC) VISIBLE,
  CONSTRAINT `qfqf`
    FOREIGN KEY (`assignmentId`)
    REFERENCES `db`.`Assignment` (`assignmentId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AssignmentExtensionLength_CoursePreferences1`
    FOREIGN KEY (`coursePreferenceId`)
    REFERENCES `db`.`CoursePreferences` (`coursePreferenceId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET GLOBAL host_cache_size=0;